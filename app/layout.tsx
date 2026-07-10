import type { Metadata } from "next";
import { Toaster } from "sonner";
import SoleChat from "@/components/SoleChat";
import CookieBanner from "@/components/CookieBanner";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n.server";
import "./globals.css";

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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
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
