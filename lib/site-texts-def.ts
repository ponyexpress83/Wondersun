
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
  { key: "terr.titleLead", label: "Titolo (prima riga)", fallback: "La Maremma Toscana:", group: "Home · Territori" },
  { key: "terr.titleEm", label: "Titolo (seconda riga, in corsivo)", fallback: "un territorio, mille emozioni", group: "Home · Territori" },
  {
    key: "terr.p1",
    label: "Paragrafo 1",
    fallback:
      "Dalle acque cristalline del Monte Argentario alle lagune di Orbetello, dalle spettacolari Terme di Saturnia a Manciano, fino ai borghi di tufo di Pitigliano e Sorano, ogni angolo della Maremma racconta una storia diversa e regala esperienze autentiche.",
    group: "Home · Territori",
    multiline: true,
  },
  {
    key: "terr.p2",
    label: "Paragrafo 2",
    fallback:
      "Passeggia tra i vicoli senza tempo di Capalbio, scopri la natura incontaminata del Parco della Maremma, lasciati conquistare dal fascino marinaro di Castiglione della Pescaia, assapora i grandi vini di Scansano e vivi il carattere genuino dei piccoli borghi, delle aziende agricole e delle botteghe artigiane che rendono questa terra unica.",
    group: "Home · Territori",
    multiline: true,
  },
  {
    key: "terr.p3",
    label: "Paragrafo 3",
    fallback:
      "Qui il mare incontra la campagna, le colline si affacciano su spiagge incontaminate e tradizioni secolari convivono con esperienze moderne. Ogni luogo ha un'identità speciale, ogni esperienza nasce dalle persone che vivono questo territorio ogni giorno.",
    group: "Home · Territori",
    multiline: true,
  },
  {
    key: "terr.p4",
    label: "Paragrafo 4",
    fallback:
      "Con Wondersun puoi scoprire la Maremma più autentica attraverso attività selezionate con cura, creando il tuo itinerario ideale tra natura, enogastronomia, mare, benessere, sport e cultura.",
    group: "Home · Territori",
    multiline: true,
  },
  { key: "terr.ctaTitle", label: "Invito finale (titolo)", fallback: "La tua prossima esperienza inizia da qui.", group: "Home · Territori" },
  { key: "terr.ctaSubtitle", label: "Invito finale (sottotitolo)", fallback: "Quale angolo di Maremma vuoi esplorare per primo?", group: "Home · Territori" },
  { key: "terr.ctaButton", label: "Testo del pulsante", fallback: "Esplora tutte le esperienze", group: "Home · Territori" },

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
