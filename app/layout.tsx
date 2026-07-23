import type { Metadata } from "next";
import { Poppins, Nunito_Sans, Caveat } from "next/font/google";
import { Toaster } from "sonner";
import SoleChat from "@/components/SoleChat";
import CookieBanner from "@/components/CookieBanner";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n.server";
import "./globals.css";

// Font self-hosted via next/font (GDPR: nessuna richiesta a Google a runtime,
// i file font sono serviti dal nostro dominio). Esposti come CSS variables.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
  // Next non ha le metriche di override per "Nunito Sans": disattiviamo il
  // fallback automatico per evitare il warning di build (il font resta self-hosted).
  adjustFontFallback: false,
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wondersun.it";
const ogImage =
  "https://images.unsplash.com/photo-1533514114760-4389f572ad05?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wondersun · Local Escape · Maremma Toscana",
    template: "%s · Wondersun",
  },
  description:
    "La guida digitale per scoprire, scegliere e organizzare esperienze autentiche nella Maremma Toscana. Nessun pacchetto imposto: componi il tuo percorso con Sole, l'assistente AI, al tuo fianco 24h.",
  applicationName: "Wondersun",
  keywords: [
    "Maremma",
    "Costa d'Argento",
    "Argentario",
    "esperienze Maremma",
    "cosa fare in Maremma",
    "Sorano",
    "Manciano",
    "Porto Ercole",
    "esperienze Toscana",
    "vacanza Maremma",
  ],
  authors: [{ name: "Wondersun" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Wondersun · Local Escape · Maremma Toscana",
    description:
      "Scopri, scegli e organizza le esperienze che desideri nella Maremma Toscana. Nessuno decide la tua vacanza al posto tuo.",
    url: siteUrl,
    siteName: "Wondersun",
    locale: "it_IT",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Wondersun · Maremma Toscana" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wondersun · Local Escape · Maremma Toscana",
    description: "Esperienze autentiche nella Maremma Toscana. Nessuno decide la tua vacanza al posto tuo.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Wondersun",
      url: siteUrl,
      description:
        "Guida digitale per esperienze autentiche nella Maremma Toscana. Non è un'agenzia di viaggio né un tour operator.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Ercole",
        addressRegion: "GR",
        addressCountry: "IT",
      },
      areaServed: "Maremma Toscana, Costa d'Argento",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Wondersun",
      inLanguage: "it-IT",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/esperienze?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale} className={`${poppins.variable} ${nunitoSans.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <LocaleProvider initial={locale}>
          {children}
          <SoleChat />
          <CookieBanner />
        </LocaleProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
