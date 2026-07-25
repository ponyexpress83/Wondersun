import type { Locale } from "@/lib/i18n";

/**
 * Dizionari per i contenuti statici della homepage + navbar + footer.
 * I contenuti dinamici (schede esperienza dal DB) non sono tradotti qui.
 */
export interface Dictionary {
  nav: {
    home: string;
    experiences: string;
    howItWorks: string;
    maremma: string;
    about: string;
    contact: string;
    becomeSupplier: string;
    login: string;
    loginRegister: string;
    discover: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    lead: string;
    ctaExplore: string;
    ctaHow: string;
    searchPlaceholder: string;
    searchCta: string;
    trust: string[];
    stats: { value: string; label: string }[];
    quickLinks: string[];
    strip: string[];
  };
  exp: { badge: string; titleLead: string; titleEm: string; sub: string; cta: string };
  how: {
    badge: string;
    titleLead: string;
    titleEm: string;
    steps: { title: string; description: string }[];
  };
  terr: {
    badge: string;
    titleLead: string;
    titleEm: string;
    count: string;
    explore: string;
    areas: Record<string, string>;
  };
  testi: {
    badge: string;
    titleLead: string;
    titleEm: string;
    items: string[];
  };
  supplier: {
    badge: string;
    titleLead: string;
    titleEm: string;
    lead: string;
    benefits: { label: string; note: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
    priceTitle: string;
    subLabel: string;
    perMonth: string;
    freeBadge: string;
    commissionLabel: string;
    commissionValue: string;
    commissionNote: string;
    premiumLabel: string;
    premiumValue: string;
    note: string;
  };
  footer: {
    tagline: string;
    notAgency: string;
    exploreTitle: string;
    infoTitle: string;
    legalNotice: string;
    launching: string;
    links: Record<string, string>;
  };
}

const it: Dictionary = {
  nav: {
    home: "Home",
    experiences: "Esperienze",
    howItWorks: "Come Funziona",
    maremma: "La Maremma",
    about: "Chi Siamo",
    contact: "Contatti",
    becomeSupplier: "Diventa Fornitore",
    login: "Accedi",
    loginRegister: "Accedi / Registrati",
    discover: "Scopri",
    dashboard: "Dashboard",
    logout: "Esci",
  },
  hero: {
    eyebrow: "Maremma · Costa d'Argento",
    titleLead: "Nessuno decide la tua vacanza",
    titleEm: "al posto tuo.",
    lead: "Raccontaci cosa ami, la nostra AI crea per te esperienze uniche in Maremma Toscana.",
    ctaExplore: "Esplora le esperienze",
    ctaHow: "Come funziona",
    searchPlaceholder: "Cerca: barca al tramonto, degustazione, trekking…",
    searchCta: "Cerca",
    trust: [
      "Esperienze selezionate",
      "Paghi solo la quota digitale, l'esperienza al fornitore",
      "Annulli gratis fino a 48h",
    ],
    stats: [
      { value: "50+", label: "Esperienze uniche in Maremma" },
      { value: "100%", label: "Personalizzate per te" },
      { value: "4", label: "Tipologie di esperienze" },
      { value: "★", label: "Prenota in sicurezza e vivi senza pensieri" },
    ],
    quickLinks: ["Mare & Costa", "Enogastronomia", "Natura & Avventura", "Cultura & Arte"],
    strip: [
      "Esperienze di operatori locali indipendenti",
      "Tu componi il tuo percorso, esperienza dopo esperienza",
      "Nessun pacchetto imposto, nessun intermediario sul prezzo",
    ],
  },
  exp: {
    badge: "Le Nostre Esperienze",
    titleLead: "Ogni viaggio è",
    titleEm: "unico",
    sub: "Selezioniamo le esperienze più autentiche della Maremma, dai migliori operatori locali. Tu scegli e componi il tuo percorso, una esperienza alla volta.",
    cta: "Vedi tutte le esperienze",
  },
  how: {
    badge: "Come Funziona",
    titleLead: "Quattro passi verso la tua",
    titleEm: "esperienza",
    steps: [
      { title: "Scegli cosa vuoi vivere", description: "Esplora il catalogo delle esperienze autentiche selezionate in Maremma Toscana e trova quella giusta per te." },
      { title: "Invia la richiesta", description: "Indica data e numero di partecipanti e invia la richiesta al fornitore, direttamente dalla scheda dell'esperienza." },
      { title: "Ricevi la conferma", description: "Il fornitore conferma la disponibilità e viene confermato il servizio digitale Wondersun." },
      { title: "Vivi la tua esperienza", description: "Ricevi tutti i dettagli via email e goditi la tua esperienza in Maremma." },
    ],
  },
  terr: {
    badge: "Il Territorio",
    titleLead: "Quattro anime della",
    titleEm: "Maremma",
    count: "esperienze",
    explore: "Esplora",
    areas: {
      Argentario: "Il promontorio del mare cristallino, tra Porto Santo Stefano e Porto Ercole.",
      Manciano: "Le colline maremmane, le terme di Saturnia e i vigneti DOC.",
      Sorano: "I borghi etruschi e le vie cave scavate nel tufo.",
      Arcille: "Cuore agricolo della Maremma, sapori autentici e tradizioni butteri.",
    },
  },
  testi: {
    badge: "Testimonianze",
    titleLead: "Cosa dicono i nostri",
    titleEm: "ospiti",
    items: [
      "Ho prenotato l'esperienza in barca al tramonto e poi una cena con chef locale. Tutto perfetto, gestione impeccabile. Tornerò sicuramente.",
      "Abbiamo composto la nostra settimana in Maremma esperienza dopo esperienza, come volevamo noi. Wondersun ci ha fatto scoprire posti che da soli non avremmo mai trovato.",
      "L'e-bike tour tra Sorano e Pitigliano è stata l'esperienza più bella delle vacanze. La guida era preparatissima e i ragazzi si sono divertiti tantissimo.",
    ],
  },
  supplier: {
    badge: "Per i Fornitori",
    titleLead: "Più di una vetrina.",
    titleEm: "Un partner",
    lead: "Non ci limitiamo a pubblicare una scheda: ti aiutiamo concretamente a valorizzare il tuo lavoro e a crescere — con supporto umano rapido, contenuti curati e promozione. Gestisci esperienze e richieste da un'unica dashboard.",
    benefits: [
      { label: "Iscrizione gratuita", note: "Poi €29/mese, disdici quando vuoi" },
      { label: "Crescita, non solo visibilità", note: "Contenuti, promozione, ottimizzazione" },
      { label: "Gli incassi restano tuoi", note: "Il cliente paga te, direttamente" },
      { label: "Supporto umano", note: "Rapido, diretto e continuo" },
    ],
    ctaPrimary: "Diventa partner",
    ctaSecondary: "Area fornitori",
    priceTitle: "Quanto costa?",
    subLabel: "Abbonamento mensile",
    perMonth: "/mese",
    freeBadge: "Iscrizione gratuita",
    commissionLabel: "Commissione sui tuoi incassi",
    commissionValue: "0%",
    commissionNote: "il cliente paga te direttamente",
    premiumLabel: "Attivazione e setup",
    premiumValue: "Nessun costo",
    note: "Wondersun incassa solo il proprio corrispettivo per il servizio digitale. Il prezzo dell'esperienza resta tuo e lo ricevi direttamente dal cliente.",
  },
  footer: {
    tagline: "Concierge digitale delle esperienze autentiche della Maremma Toscana. Dal mare all'entroterra, il tuo Local Escape su misura.",
    notAgency: "Non siamo un'agenzia viaggi",
    exploreTitle: "Esplora",
    infoTitle: "Info",
    legalNotice: "Wondersun pubblica schede di esperienze e servizi offerti da fornitori indipendenti. Non è un'agenzia di viaggio né un tour operator.",
    launching: "Piattaforma in fase di lancio",
    links: {
      allExperiences: "Tutte le Esperienze",
      howItWorks: "Come Funziona",
      about: "Chi Siamo",
      personalArea: "Area Personale",
      becomeSupplier: "Diventa Fornitore",
      supplierArea: "Area Fornitori",
      privacy: "Informativa Privacy",
      terms: "Termini — Utente",
      termsSupplier: "Termini — Fornitori",
      cookie: "Cookie Policy",
    },
  },
};

const en: Dictionary = {
  nav: {
    home: "Home",
    experiences: "Experiences",
    howItWorks: "How it works",
    maremma: "The Maremma",
    about: "About us",
    contact: "Contact",
    becomeSupplier: "Become a partner",
    login: "Log in",
    loginRegister: "Log in / Sign up",
    discover: "Explore",
    dashboard: "Dashboard",
    logout: "Log out",
  },
  hero: {
    eyebrow: "Maremma · Costa d'Argento",
    titleLead: "No one decides your holiday",
    titleEm: "for you.",
    lead: "Tell us what you love: our AI suggests the experiences that are right for you across the Tuscan Maremma. No fixed bundle — you choose and arrange your own trip.",
    ctaExplore: "Explore experiences",
    ctaHow: "How it works",
    searchPlaceholder: "Search: sunset boat trip, wine tasting, trekking…",
    searchCta: "Search",
    trust: [
      "Hand-picked experiences",
      "You pay only the digital fee, the experience to the operator",
      "Free cancellation up to 48h",
    ],
    stats: [
      { value: "50+", label: "Unique experiences across the Tuscan Maremma" },
      { value: "100%", label: "Tailored to you" },
      { value: "4", label: "Types of experience" },
      { value: "★", label: "Book safely and travel worry-free" },
    ],
    quickLinks: ["Sea & Coast", "Food & Wine", "Nature & Adventure", "Culture & Art"],
    strip: [
      "Experiences by independent local operators",
      "You build your own path, one experience at a time",
      "No imposed bundle, no middleman on the price",
    ],
  },
  exp: {
    badge: "Our Experiences",
    titleLead: "Every journey is",
    titleEm: "unique",
    sub: "We select the most authentic experiences in the Maremma, from the best local operators. You choose and build your own path, one experience at a time.",
    cta: "See all experiences",
  },
  how: {
    badge: "How it works",
    titleLead: "Four steps to your",
    titleEm: "experience",
    steps: [
      { title: "Choose what to live", description: "Browse the curated experiences across the Tuscan Maremma and find the right one for you." },
      { title: "Send the request", description: "Pick the date and number of guests and send the request to the operator, right from the experience page." },
      { title: "Get the confirmation", description: "The operator confirms availability and the Wondersun digital service is confirmed." },
      { title: "Live your experience", description: "Get all the details by email and enjoy your Maremma experience." },
    ],
  },
  terr: {
    badge: "The Territory",
    titleLead: "Four souls of the",
    titleEm: "Maremma",
    count: "experiences",
    explore: "Explore",
    areas: {
      Argentario: "The promontory of crystal-clear sea, between Porto Santo Stefano and Porto Ercole.",
      Manciano: "The Maremma hills, the Saturnia hot springs and DOC vineyards.",
      Sorano: "Etruscan villages and the sunken lanes carved into the tuff.",
      Arcille: "The agricultural heart of the Maremma, authentic flavours and butteri traditions.",
    },
  },
  testi: {
    badge: "Reviews",
    titleLead: "What our",
    titleEm: "guests say",
    items: [
      "I booked the sunset boat experience and then a dinner with a local chef. Everything was perfect, flawlessly managed. I'll definitely be back.",
      "We built our week in the Maremma one experience at a time, exactly how we wanted. Wondersun helped us discover places we'd never have found on our own.",
      "The e-bike tour between Sorano and Pitigliano was the best experience of the holiday. The guide was superb and the kids had a blast.",
    ],
  },
  supplier: {
    badge: "For Operators",
    titleLead: "More than a listing.",
    titleEm: "A partner",
    lead: "We don't just publish a listing: we actively help you showcase your work and grow — with fast human support, polished content and promotion. Manage experiences and requests from a single dashboard.",
    benefits: [
      { label: "Free sign-up", note: "Then €29/month, cancel anytime" },
      { label: "Growth, not just visibility", note: "Content, promotion, optimisation" },
      { label: "Your revenue stays yours", note: "The client pays you, directly" },
      { label: "Human support", note: "Fast, direct and ongoing" },
    ],
    ctaPrimary: "Become a partner",
    ctaSecondary: "Operator area",
    priceTitle: "How much does it cost?",
    subLabel: "Monthly subscription",
    perMonth: "/month",
    freeBadge: "Free sign-up",
    commissionLabel: "Commission on your revenue",
    commissionValue: "0%",
    commissionNote: "the client pays you directly",
    premiumLabel: "Activation & setup",
    premiumValue: "No cost",
    note: "Wondersun only charges its own fee for the digital service. The experience price stays yours and you receive it directly from the client.",
  },
  footer: {
    tagline: "The digital concierge for authentic experiences across the Tuscan Maremma. From the coast to the inland — your tailor-made Local Escape.",
    notAgency: "We are not a travel agency",
    exploreTitle: "Explore",
    infoTitle: "Info",
    legalNotice: "Wondersun publishes listings of experiences and services offered by independent operators. It is not a travel agency or a tour operator.",
    launching: "Platform launching soon",
    links: {
      allExperiences: "All Experiences",
      howItWorks: "How it works",
      about: "About us",
      personalArea: "My Account",
      becomeSupplier: "Become a partner",
      supplierArea: "Operator area",
      privacy: "Privacy Policy",
      terms: "Terms — Users",
      termsSupplier: "Terms — Operators",
      cookie: "Cookie Policy",
    },
  },
};

const DICTS: Record<Locale, Dictionary> = { it, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? it;
}
