import { NextRequest, NextResponse } from "next/server";
import { contactTopics } from "@/lib/content";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_192;
const WINDOW_MS = 60 * 60 * 1_000;
const MAX_PER_WINDOW = 5;

// Ograniczanie liczby zgłoszeń na instancję. W środowisku serverless to
// zabezpieczenie pomocnicze — przy dużym ruchu użyj współdzielonego rate limitera.
const attempts = new Map<string, { count: number; resetAt: number }>();

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function isEmail(email: string) {
  return email.length <= 150 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
}

function tooManyAttempts(ip: string | null) {
  if (!ip) return false;
  const now = Date.now();
  if (attempts.size > 1_000) {
    for (const [key, record] of attempts) {
      if (record.resetAt <= now) attempts.delete(key);
    }
  }
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  // Formularz ma działać tylko z naszej strony, a nie jako otwarta bramka e-mail.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return jsonError("Nie można wysłać formularza z tej strony.", 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return jsonError("Nieprawidłowy format formularza.", 415);
  }
  const declaredSize = Number(request.headers.get("content-length") || "0");
  if (declaredSize > MAX_BODY_BYTES) {
    return jsonError("Wiadomość jest za długa.", 413);
  }

  let data: Record<string, unknown>;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) {
      return jsonError("Wiadomość jest za długa.", 413);
    }
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonError("Nieprawidłowe dane formularza.", 400);
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return jsonError("Nieprawidłowe dane formularza.", 400);
  }

  // Pole-pułapka pozostawiane puste przez ludzi.
  if (typeof data.website === "string" && data.website.trim()) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const service = typeof data.service === "string" ? data.service.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (
    name.length < 2 || name.length > 100 || /[\r\n]/.test(name) ||
    !isEmail(email) || /[\r\n]/.test(email) ||
    !contactTopics.some((topic) => topic === service) ||
    message.length < 10 || message.length > 2_000
  ) {
    return jsonError("Sprawdź pola formularza i spróbuj ponownie.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !fromEmail || !toEmail || !isEmail(fromEmail) || !isEmail(toEmail)) {
    return jsonError("Formularz jest chwilowo niedostępny. Spróbuj później.", 503);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (tooManyAttempts(ip)) {
    return jsonError("Zbyt wiele prób wysyłki. Spróbuj ponownie później.", 429);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `LUMA Dental Studio <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `Nowe zapytanie ze strony LUMA — ${service}`,
        text: [
          "Nowa wiadomość z formularza LUMA Dental Studio", "",
          `Imię i nazwisko: ${name}`,
          `E-mail: ${email}`,
          `Temat: ${service}`, "",
          "Wiadomość:", message
        ].join("\n")
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store"
    });
    if (!response.ok) {
      // Nie zapisujemy w logach danych pacjentów ani klucza API.
      console.error("Wysyłka e-maila z formularza nie powiodła się. HTTP:", response.status);
      return jsonError("Nie udało się wysłać wiadomości. Spróbuj ponownie później.", 502);
    }
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Błąd połączenia z dostawcą poczty w formularzu.");
    return jsonError("Nie udało się wysłać wiadomości. Spróbuj ponownie później.", 502);
  }
}