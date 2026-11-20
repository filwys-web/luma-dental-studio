# LUMA Dental Studio — pokazowa strona gabinetu z formularzem Gmail

Strona koncepcyjna w Next.js 15, React 19, TypeScript i CSS. Formularz wysyła wiadomość za pośrednictwem Gmail SMTP / Nodemailer — **bez Resend, bez bazy danych i bez własnej domeny**. To integracja do niewielkich testów, nie pełne rozwiązanie produkcyjne dla placówki medycznej.

## Co trzeba zrobić po wdrożeniu na Vercel

Do testów używamy konta `filwys.web@gmail.com` jako **nadawcy i odbiorcy**. To ustawienie jest zapisane tylko w serwerowym pliku `app/api/contact/route.ts`.

1. Na koncie Google `filwys.web@gmail.com` włącz weryfikację dwuetapową: <https://myaccount.google.com/security>.
2. Wejdź na <https://myaccount.google.com/apppasswords>. Utwórz nowe hasło do aplikacji o nazwie np. `LUMA Vercel`; zapisz 16-znakowe hasło wyświetlone przez Google.
3. Otwórz **Vercel → filwys-web1 → luma-dental-studio-yawf → Settings → Environment Variables** i dodaj:
   - `GMAIL_APP_PASSWORD` = 16-znakowe hasło do aplikacji Google (bez spacji; zmienna ma pozostać poufna)
   - Environment: **Production**.
4. Zapisz zmienną, a następnie przejdź do **Deployments → Redeploy** najnowszej produkcyjnej wersji strony.
5. Otwórz <https://luma-dental-studio-yawf.vercel.app/#kontakt>, wypełnij formularz danymi testowymi i wyślij. Sprawdź skrzynkę odbiorczą `filwys.web@gmail.com`, a w razie potrzeby folder spam oraz logi Runtime na Vercel.

**Nie wpisuj hasła aplikacji w ChatGPT, kodzie, GitHubie ani w formularzu na stronie.** Jeśli zresetujesz główne hasło do Google, hasło do aplikacji może zostać unieważnione i trzeba wygenerować nowe.

W repozytorium kodu klucz prywatny nie jest przechowywany. Jeżeli nie ustawisz zmiennej w Vercel, formularz pokaże informację o braku konfiguracji. Sukces na stronie oznacza, że Gmail SMTP przyjął wiadomość do wysyłki — sprawdź, czy dotarła do skrzynki.

## Ograniczenia i bezpieczeństwo

- Gmail SMTP z hasłem do aplikacji służy do prostych testów, ale może być blokowany przez zabezpieczenia Google; Google rekomenduje nowoczesne metody logowania, a przy większej skali specjalistyczne usługi wysyłkowe.
- W formularzu jest walidacja, pole-pułapka i pomocniczy limit na instancję Vercel. **Nie jest to pełna ochrona przed spamem**. Przed użyciem na produkcyjnej stronie gabinetu dodaj współdzielony limiter oraz Turnstile/CAPTCHA albo inną weryfikację.
- Nie zbieraj przez ogólny formularz danych o zdrowiu ani dokumentacji medycznej. Przed rzeczywistym wdrożeniem potrzebne są odpowiednie informacje RODO i ocena kwestii przetwarzania danych.
- Nie używaj prywatnej skrzynki Filipa do obsługi cudzych gabinetów. Dla klienta wdrażaj adres i system wysyłki należący do klienta.
- Domena, nazwiska lekarzy, ceny, dane gabinetu oraz zdjęcia na stronie są demonstracyjne; projekt ma `noindex, nofollow`.

## Uruchomienie lokalne

Node.js 22.x, `npm install`, `npm run dev`. Lokalnie uzupełnij `GMAIL_APP_PASSWORD` w `.env.local`; plik jest wykluczony z Git. Test builda: `npm run build`.