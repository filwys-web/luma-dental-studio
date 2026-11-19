import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMA Dental Studio | Stomatologia z uważnością",
  description:
    "Poznaj LUMA Dental Studio — nowoczesne podejście do stomatologii, ortodoncji i pięknego uśmiechu.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "LUMA Dental Studio — Twój uśmiech w dobrych rękach",
    description: "Nowoczesna stomatologia, ortodoncja i troska o Twój uśmiech. Poznaj nasz zespół i ofertę.",
    locale: "pl_PL",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}