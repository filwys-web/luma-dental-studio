/**
 * Wszystkie dane marki są demonstracyjne. Przed wdrożeniem dla prawdziwego
 * gabinetu zmień treści, dane kontaktowe, ceny i fotografie personelu.
 */
export const clinic = {
  name: "LUMA Dental Studio",
  city: "Poznań",
  neighborhood: "Jeżyce",
  phoneDisplay: "+48 000 000 000",
  emailDisplay: "kontakt@luma-dental.example",
  hours: [
    { day: "Poniedziałek – piątek", time: "08:00 – 20:00" },
    { day: "Sobota", time: "09:00 – 14:00" },
    { day: "Niedziela", time: "Nieczynne" }
  ]
};

export const contactTopics = [
  "Konsultacja stomatologiczna",
  "Stomatologia estetyczna",
  "Ortodoncja",
  "Higienizacja",
  "Inne pytanie"
] as const;

export const treatments = [
  { number: "01", icon: "tooth", title: "Stomatologia zachowawcza", subtitle: "Zdrowie od podstaw", description: "Profilaktyka, higienizacja i leczenie próchnicy w spokojnej, komfortowej atmosferze.", href: "#cennik" },
  { number: "02", icon: "sparkles", title: "Stomatologia estetyczna", subtitle: "Naturalne piękno", description: "Wybielanie, bonding i odbudowa uśmiechu z dbałością o każdy detal.", href: "#cennik" },
  { number: "03", icon: "braces", title: "Ortodoncja", subtitle: "Uśmiech w harmonii", description: "Nowoczesne metody prostowania zębów dopasowane do Twojego stylu życia.", href: "#cennik" },
  { number: "04", icon: "shield", title: "Implantologia", subtitle: "Komfort na lata", description: "Kompleksowe rozwiązania odtwarzające funkcję i naturalną estetykę uzębienia.", href: "#cennik" }
] as const;

export const team = [
  {
    name: "lek. dent. Julia Nowak",
    role: "Stomatologia estetyczna",
    description: "W pracy stawia na empatię, precyzję i piękno naturalnego uśmiechu.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=840&q=85",
    position: "center 25%"
  },
  {
    name: "lek. dent. Michał Zieliński",
    role: "Ortodoncja",
    description: "Łączy nowoczesne technologie z indywidualnym planowaniem leczenia.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=840&q=85",
    position: "center 24%"
  },
  {
    name: "lek. dent. Aleksandra Wiśniewska",
    role: "Stomatologia zachowawcza",
    description: "Pomaga pacjentom poczuć się swobodnie już od pierwszego spotkania.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=840&q=85",
    position: "center 22%"
  }
] as const;

export const priceGroups = [
  {
    id: "profilaktyka",
    label: "Profilaktyka",
    description: "Małe kroki, wielka różnica — zadbaj o zdrowie zębów na co dzień.",
    items: [
      { name: "Konsultacja stomatologiczna", price: "180 zł", note: "Ocena stanu uzębienia" },
      { name: "Higienizacja kompleksowa", price: "od 350 zł", note: "Skaling, piaskowanie, polerowanie" },
      { name: "Fluoryzacja", price: "100 zł", note: "Wzmocnienie szkliwa" },
      { name: "Wypełnienie kompozytowe", price: "od 300 zł", note: "Estetyczna odbudowa zęba" }
    ]
  },
  {
    id: "estetyka",
    label: "Estetyka",
    description: "Subtelne rozwiązania, które podkreślają piękno Twojego uśmiechu.",
    items: [
      { name: "Konsultacja estetyczna", price: "200 zł", note: "Indywidualny plan uśmiechu" },
      { name: "Wybielanie gabinetowe", price: "od 950 zł", note: "Pod kontrolą lekarza" },
      { name: "Bonding zęba", price: "od 700 zł", note: "Korekta kształtu i koloru" },
      { name: "Licówka porcelanowa", price: "od 2 000 zł", note: "Naturalny efekt estetyczny" }
    ]
  },
  {
    id: "ortodoncja",
    label: "Ortodoncja",
    description: "Proste zęby i harmonijny uśmiech na Twoich zasadach.",
    items: [
      { name: "Konsultacja ortodontyczna", price: "250 zł", note: "Diagnostyka i planowanie" },
      { name: "Aparat stały metalowy", price: "od 2 400 zł", note: "Cena za jeden łuk" },
      { name: "Aparat stały estetyczny", price: "od 3 100 zł", note: "Cena za jeden łuk" },
      { name: "Wizyta kontrolna", price: "od 200 zł", note: "Dopasowanie aparatu" }
    ]
  }
] as const;

export const faqs = [
  { question: "Jak wygląda pierwsza wizyta?", answer: "Zaczynamy od rozmowy, badania i omówienia Twoich oczekiwań. Następnie proponujemy indywidualny plan leczenia oraz orientacyjny kosztorys." },
  { question: "Czy wykonujecie leczenie bez bólu?", answer: "Komfort pacjenta jest dla nas priorytetem. W zależności od zabiegu dobieramy odpowiednie metody znieczulenia i tłumaczymy każdy etap leczenia." },
  { question: "Czy mogę zapłacić za leczenie w ratach?", answer: "W sprawie możliwości rozłożenia płatności na raty prosimy o kontakt z recepcją. Szczegóły zależą od zakresu planowanego leczenia." },
  { question: "Jak często należy wykonywać higienizację?", answer: "Najczęściej zaleca się ją co około 6 miesięcy, jednak częstotliwość powinien ustalić dentysta lub higienistka na podstawie Twoich potrzeb." }
] as const;