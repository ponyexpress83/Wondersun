
/**
 * Testi del sito modificabili dall'amministrazione (Allegato A § 4.1 —
 * gestione dei contenuti delle pagine).
 *
 * Sono salvati in platform_settings con prefisso "text.". Ogni voce ha un
 * valore predefinito: se non è stata personalizzata, il sito mostra quello.
 */
export const PREFIX = "text.";

export interface TextField {
  key: string;
  label: string;
  /** Testo attualmente mostrato dal sito se non personalizzato. */
  fallback: string;
  group: string;
  multiline?: boolean;
}

/** Elenco dei testi modificabili, raggruppati per sezione. */
export const SITE_TEXTS: TextField[] = [
  // Home · apertura
  { key: "hero.titleLead", label: "Titolo (prima riga)", fallback: "Nessuno decide la tua vacanza", group: "Home · Apertura" },
  { key: "hero.titleEm", label: "Titolo (parte evidenziata)", fallback: "al posto tuo.", group: "Home · Apertura" },
  {
    key: "hero.lead",
    label: "Sottotitolo",
    fallback: "Raccontaci cosa ami, la nostra AI crea per te esperienze uniche in Maremma Toscana.",
    group: "Home · Apertura",
    multiline: true,
  },

  // Home · territori
  { key: "terr.badge", label: "Etichetta sezione", fallback: "Il Territorio", group: "Home · Territori" },
  { key: "terr.titleLead", label: "Titolo (prima parte)", fallback: "Quattro anime della", group: "Home · Territori" },
  { key: "terr.titleEm", label: "Titolo (parte evidenziata)", fallback: "Maremma", group: "Home · Territori" },
  {
    key: "terr.intro",
    label: "Testo introduttivo",
    fallback:
      "Dal mare all'entroterra, tra coste selvagge e borghi del tufo. Ogni zona è un mondo a sé, con i suoi artigiani e i suoi sapori.",
    group: "Home · Territori",
    multiline: true,
  },

  // Home · come funziona
  { key: "how.badge", label: "Etichetta sezione", fallback: "Come Funziona", group: "Home · Come funziona" },
  { key: "how.titleLead", label: "Titolo (prima parte)", fallback: "Quattro passi verso la tua", group: "Home · Come funziona" },
  { key: "how.titleEm", label: "Titolo (parte evidenziata)", fallback: "esperienza", group: "Home · Come funziona" },

  // Home · esperienze
  { key: "exp.badge", label: "Etichetta sezione", fallback: "Le Nostre Esperienze", group: "Home · Esperienze" },
  { key: "exp.titleLead", label: "Titolo (prima parte)", fallback: "Ogni viaggio è", group: "Home · Esperienze" },
  { key: "exp.titleEm", label: "Titolo (parte evidenziata)", fallback: "unico", group: "Home · Esperienze" },

  // Catalogo
  { key: "catalog.title", label: "Titolo della pagina", fallback: "Catalogo Esperienze", group: "Catalogo" },
  {
    key: "catalog.subtitle",
    label: "Sottotitolo",
    fallback: "Scopri e prenota le migliori esperienze selezionate per te in Maremma Toscana.",
    group: "Catalogo",
    multiline: true,
  },

  // Footer
  {
    key: "footer.tagline",
    label: "Testo del footer",
    fallback:
      "Concierge digitale delle esperienze autentiche della Maremma Toscana. Dal mare all'entroterra, il tuo Local Escape su misura.",
    group: "Footer",
    multiline: true,
  },
];

export type SiteTexts = Record<string, string>;

/**
 * Legge i testi personalizzati. Ritorna una mappa chiave → testo, già completata
 * con i valori predefiniti: le pagine possono usarla senza ulteriori controlli.
 */

export function settingKeyFor(textKey: string): string {
  return `${PREFIX}${textKey}`;
}
