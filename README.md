# LUMA Dental Studio — strona gabinetu

Responsywna strona kliniki stomatologicznej wykonana w **Next.js 15 (App Router), React 19, TypeScript i CSS**. Projekt zawiera formularz kontaktowy wysyłający wiadomości przez **Resend** — bez bazy danych.

## Uruchomienie

Wymagany Node.js 22.x.

```bash
npm install
npm run dev
```

Adres lokalny: `http://localhost:3000`. Kontrola: `npm run typecheck` i `npm run build`.

## Konfiguracja formularza / Resend

1. Załóż konto w [Resend](https://resend.com) i **zweryfikuj własną domenę wysyłkową** w zakładce Domains (Resend pokaże rekordy DNS do dodania u rejestratora). Możesz użyć subdomeny, np. `mail.twojadomena.pl`.
2. W Resend utwórz klucz API z uprawnieniem do wysyłki. **Nie udostępniaj klucza w rozmowie, nie dodawaj go do GitHuba.**
3. Na Vercelu otwórz **Project → Settings → Environment Variables** i ustaw dla **Production**:

   | Zmienna | Wartość |
   | --- | --- |
   | `RESEND_API_KEY` | Prywatny klucz z Resend |
   | `RESEND_FROM_EMAIL` | Adres w **zweryfikowanej domenie** (np. `formularz@mail.twojadomena.pl`) |
   | `CONTACT_TO_EMAIL` | Skrzynka, na którą mają przychodzić wiadomości (np. Gmail) |

4. **Wykonaj nowy deployment** po ustawieniu zmiennych (Vercel → Deployments → Redeploy) i prześlij wiadomość testową. W Resend testowa domena `resend.dev` umożliwia tylko ograniczone testy, dlatego do dostarczania wiadomości na dowolne skrzynki zweryfikuj własną domenę.

Do lokalnych testów skopiuj `.env.example` jako `.env.local` i uzupełnij prywatne wartości. Plik `.env.local` jest wykluczony z Git.

### Jak działa kontakt

- Formularz POST do `/api/contact` → walidacja danych → API Resend → wiadomość na `CONTACT_TO_EMAIL` z `reply_to` ustawionym na e-mail nadawcy.
- Przycisk jest blokowany podczas wysyłania, pola pozostają wypełnione przy błędzie, a komunikat potwierdzenia pojawia się **dopiero po odpowiedzi sukcesu z API Resend**.
- Obsługiwane są błędy połączenia, brak konfiguracji, niepoprawne pola i limit prób.
- Dodano honeypot, kontrolę długości danych i prosty limit zgłoszeń na instancję. **Limit w pamięci nie jest globalny dla Vercel Serverless**. Przed szerszym uruchomieniem podłącz rozproszony rate limiter i CAPTCHA/Turnstile.
- Formularz nie zapisuje zgłoszeń do bazy danych. Klucz jest używany tylko po stronie serwera.

## Wdrożenie

Repozytorium: `filwys-web/luma-dental-studio`. W Vercel połącz repozytorium w **Settings → Git** (branch: `main`), jeśli jeszcze nie jest podłączone. Kolejne pushe będą wdrażane automatycznie. Alternatywnie wdrażaj kod bezpośrednio na Vercel.

## Edycja strony

- Dane kliniki, personel, ceny, FAQ i tematy kontaktu: `lib/content.ts`.
- Kolory i responsywność: `app/globals.css`.
- Widok oraz interakcje: `app/page.tsx`.
- API formularza: `app/api/contact/route.ts`.
- Metadata: `app/layout.tsx`.

## Przed wdrożeniem dla prawdziwego gabinetu

Marka LUMA, nazwiska lekarzy, cennik, lokalizacja i kontakt są fikcyjne. Zdjęcia mają charakter ilustracyjny i nie przedstawiają wymienionych lekarzy. Konieczne jest podmienienie danych, zdjęć i treści, zweryfikowanie praw do fotografii oraz przygotowanie rzeczywistej informacji RODO/polityki prywatności i dokumentacji powierzenia przetwarzania danych u dostawców (w tym poczty). Nie zbieraj przez ogólny formularz informacji o zdrowiu ani dokumentacji medycznej. Strona ma meta robots `noindex, nofollow`, żeby nie indeksować fikcyjnego gabinetu.