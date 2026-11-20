import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactTopics } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 20;

// LUMA jest projektem pokazowym. W realnym gabinecie użyj konta klienta,
// niezależnej skrzynki i dodatkowej ochrony formularza przed spamem.
const GMAIL_ADDRESS = "filwys.web@gmail.com";
const MAX_BODY_BYTES = 8192;
const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const attempts = new Map<string, { count: number; expiresAt: number }>();

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function validEmail(value: string) {
  return value.length <= 150 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function rateLimited(ip: string | null) {
  if (!ip) return false;
  const now = Date.now();
  if (attempts.size > 1000) {
    for (const [key, item] of attempts) {
      if (item.expiresAt <= now) attempts.delete(key);
    }
  }
  const item = attempts.get(ip);
  if (!item || item.expiresAt <= now) {
    attempts.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }
  item.count++;
  return item.count > MAX_PER_HOUR;
}

export async function POST(request: NextRequest) {
  // Podstawowa kontrola żądań z innych stron.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return fail("Nie można wysłać formularza z tej strony.", 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return fail("Nieprawidłowy format formularza.", 415);
  }
  const size = Number(request.headers.get("content-length") || "0");
  if (size > MAX_BODY_BYTES) return fail("Wiadomość jest za długa.", 413);

  let data: Record<string, unknown>;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) return fail("Wiadomość jest za długa.", 413);
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail("Nieprawidłowe dane formularza.", 400);
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return fail("Nieprawidłowe dane formularza.", 400);
  }

  // Ukryte pole pułapka: automatyczne formularze często je wypełniają.
  if (typeof data.website === "string" && data.website.trim()) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const service = typeof data.service === "string" ? data.service.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (
    name.length < 2 || name.length > 100 || /[\r\n]/.test(name) ||
    !validEmail(email) || /[\r\n]/.test(email) ||
    !contactTopics.some(topic => topic === service) ||
    message.length < 10 || message.length > 2000
  ) {
    return fail("Sprawdź pola formularza i spróbuj ponownie.", 400);
  }

  // Hasło aplikacji jest odczytywane wyłącznie na serwerze, nigdy w przeglądarce.
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!appPassword) {
    return fail("Formularz nie jest jeszcze skonfigurowany. Spróbuj później.", 503);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (rateLimited(ip)) {
    return fail("Zbyt wiele wiadomości. Spróbuj ponownie później.", 429);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: GMAIL_ADDRESS, pass: appPassword },
      connectionTimeout: 9000,
      greetingTimeout: 9000,
      socketTimeout: 9000
    });
    await transporter.sendMail({
      from: `LUMA Dental Studio <${GMAIL_ADDRESS}>`,
      to: GMAIL_ADDRESS,
      replyTo: { name, address: email },
      subject: `Nowe zapytanie ze strony LUMA — ${service}`,
      text: [
        "Nowa wiadomość z formularza LUMA Dental Studio", "",
        `Imię i nazwisko: ${name}`,
        `E-mail: ${email}`,
        `Temat: ${service}`, "",
        "Wiadomość:", message
      ].join("\n")
    });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Bez logowania danych zgłaszającego ani poufnych danych SMTP.
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "unknown";
    console.error("LUMA Gmail SMTP failure, code:", code);
    return fail("Nie udało się wysłać wiadomości. Sprawdź konfigurację Gmail i spróbuj ponownie.", 502);
  }
}