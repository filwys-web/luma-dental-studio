# LUMA Dental Studio — strona gabinetu

Nowoczesna, responsywna strona demonstracyjna dla gabinetu stomatologicznego. Stworzona w **Next.js (App Router), React 19, TypeScript i CSS**. Bez generatorów stron i bez gotowych szablonów HTML.

## Uruchomienie

Wymagany Node.js 20+.

```bash
npm install
npm run dev
```

Otwórz `http://localhost:3000`.

Sprawdzenie przed publikacją:

```bash
npm run typecheck
npm run build
```

## Wdrożenie na Vercel

1. Utwórz repozytorium na GitHubie, wgraj pliki tego projektu.
2. Na [vercel.com/new](https://vercel.com/new) wybierz repozytorium.
3. Framework: Next.js; katalog root: `/`.
4. Kliknij Deploy. Kolejne pushe do `main` publikują zmiany automatycznie.

## Edytowanie wersji pod klienta

- Dane kliniki, personel, ceny, FAQ i usługi: `lib/content.ts`.
- Kolory, layout i responsywność: `app/globals.css`.
- Widok i interakcje: `app/page.tsx`.
- SEO: `app/layout.tsx`.
- Favicon: `public/favicon.svg`.

## Ważne informacje

To projekt demonstracyjny. Marka LUMA, nazwiska lekarzy, zakres działalności, cennik, lokalizacja i dane kontaktowe są fikcyjne. Zdjęcia z Unsplash mają **wyłącznie charakter ilustracyjny i nie przedstawiają wymienionego personelu**. Użycie zdjęć zgodne z [licencją Unsplash](https://unsplash.com/license) należy ponownie zweryfikować przed komercyjnym wdrożeniem. Zamień je na autentyczne zdjęcia zespołu za zgodą osób przedstawionych.

Formularz kontaktowy działa jako **interaktywne demo** — waliduje pola i wyświetla komunikat, ale nie zapisuje ani nie wysyła danych. Przed udostępnieniem prawdziwej klinice podłącz bezpieczny endpoint lub system rezerwacji, dodaj politykę prywatności i odpowiednie zgody. Brak fikcyjnych referencji, ocen i statystyk pacjentów. Na stronie nie ma publicznych oznaczeń prezentacyjnych, ale meta robots pozostaje ustawione na `noindex, nofollow`, aby nie indeksować fikcyjnej placówki.