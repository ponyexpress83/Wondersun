import type { Metadata } from "next";
import { Toaster } from "sonner";
import SoleChat from "@/components/SoleChat";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wondersun · Local Escape · Maremma Toscana",
    template: "%s · Wondersun",
  },
  description:
    "Esperienze autentiche nella Maremma Toscana selezionate dai migliori artigiani locali. Dall'Argentario a Sorano — il tuo Local Escape su misura.",
  keywords: [
    "Maremma",
    "Costa d'Argento",
    "Argentario",
    "esperienze turistiche",
    "Sorano",
    "Manciano",
    "tour Toscana",
  ],
  openGraph: {
    title: "Wondersun · Local Escape · Maremma Toscana",
    description: "Esperienze autentiche nella Maremma Toscana.",
    locale: "it_IT",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SoleChat />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
