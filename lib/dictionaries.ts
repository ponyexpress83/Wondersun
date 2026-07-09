import type { Locale } from "@/lib/i18n";

/**
 * Dizionari per i contenuti statici della homepage + navbar + footer.
 * I contenuti dinamici (schede esperienza dal DB) non sono tradotti qui.
 */
export interface Dictionary {
  nav: {
    experiences: string;
    howItWorks: string;
    maremma: string;
    about: string;
    becomeSupplier: string;
    login: string;
    discover: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    lead: string;
    searchPlaceholder: string;
    searchCta: string;
    trust: string[];
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
    experiences: "Esperienze",
    howItWorks: "Come Funziona",
    maremma: "La Maremma",
    about: "Chi Siamo",
    becomeSupplier: "Diventa Fornitore",
    login: "Accedi",
    discover: "Scopri",
    dashboard: "Dashboard",
    logout: "Esci",
  },
  hero: {
    eyebrow: "Maremma · Costa d'Argento",
    titleLead: "Nessuno decide la tua vacanza",
    titleEm: "al posto tuo.",
    lead: "Scopri, scegli e organizza le esperienze che desideri — in un unico posto. Nessun itinerario imposto, nessun pacchetto preconfezionato. Solo la libertà di vivere la Maremma come vuoi tu, con Sole al tuo fianco 24 ore su 24.",
    searchPlaceholder: "Cerca: barca al tramonto, degustazione, trekking…",
    searchCta: "Cerca",
    trust: [
      "Esperienze selezionate",
      "Paghi solo la quota digitale, l'esperienza al fornitore",
      "Annulli gratis fino a 48h",
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
    titleLead: "Cinque passi verso il tuo",
    titleEm: "Local Escape",
    steps: [
      { title: "Esplora il catalogo", description: "Scopri le esperienze selezionate da Wondersun nella Maremma Toscana." },
      { title: "Scegli le tue preferite", description: "Salva le esperienze che ami e componi il tuo percorso, una esperienza alla volta." },
      { title: "Invia richiesta", description: "Indica data e numero di partecipanti. Il fornitore conferma la disponibilità." },
      { title: "Conferma & vivi", description: "Il fornitore conferma la richiesta. Online paghi solo la quota digitale Wondersun; l'esperienza la saldi a lui sul posto." },
      { title: "Vivi l'esperienza", description: "Ricevi tutti i dettagli via email e goditi la tua avventura maremmana." },
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
      { label: "3 mesi gratis", note: "Poi €29/mese, disdici quando vuoi" },
      { label: "Crescita, non solo visibilità", note: "Contenuti, promozione, ottimizzazione" },
      { label: "Paghi solo se vendi", note: "Commissione solo sul confermato" },
      { label: "Supporto umano", note: "Rapido, diretto e continuo" },
    ],
    ctaPrimary: "Diventa partner",
    ctaSecondary: "Area fornitori",
    priceTitle: "Quanto costa?",
    subLabel: "Abbonamento mensile",
    perMonth: "/mese",
    freeBadge: "3 mesi gratis",
    commissionLabel: "Commissione su prenotazione",
    commissionValue: "25%",
    commissionNote: "solo sul confermato",
    premiumLabel: "Esperienze premium (oltre €1.000)",
    premiumValue: "+ fee fissa concordata",
    note: "Nessun costo di setup, disdici quando vuoi. Il prezzo in vetrina è già comprensivo della quota Wondersun.",
  },
  footer: {
    tagline: "Il concierge digitale delle esperienze autentiche nella Maremma Toscana. Dall'Argentario a Sorano — il tuo Local Escape su misura.",
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
      privacy: "Privacy Policy",
      terms: "Termini di Servizio",
      cookie: "Cookie Policy",
    },
  },
};

const en: Dictionary = {
  nav: {
    experiences: "Experiences",
    howItWorks: "How it works",
    maremma: "The Maremma",
    about: "About us",
    becomeSupplier: "Become a partner",
    login: "Log in",
    discover: "Explore",
    dashboard: "Dashboard",
    logout: "Log out",
  },
  hero: {
    eyebrow: "Maremma · Costa d'Argento",
    titleLead: "No one decides your holiday",
    titleEm: "for you.",
    lead: "Discover, choose and arrange the experiences you want — all in one place. No fixed itinerary, no pre-packaged bundle. Just the freedom to live the Maremma your way, with Sole by your side 24/7.",
    searchPlaceholder: "Search: sunset boat trip, wine tasting, trekking…",
    searchCta: "Search",
    trust: [
      "Hand-picked experiences",
      "You pay only the digital fee, the experience to the operator",
      "Free cancellation up to 48h",
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
    titleLead: "Five steps to your",
    titleEm: "Local Escape",
    steps: [
      { title: "Browse the catalogue", description: "Discover the experiences curated by Wondersun across the Tuscan Maremma." },
      { title: "Pick your favourites", description: "Save the experiences you love and build your own path, one experience at a time." },
      { title: "Send a request", description: "Choose the date and number of guests. The operator confirms availability." },
      { title: "Confirm & enjoy", description: "The operator confirms your request. Online you pay only the Wondersun digital fee; you settle the experience with them on site." },
      { title: "Live the experience", description: "Get all the details by email and enjoy your Maremma adventure." },
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
      { label: "3 months free", note: "Then €29/month, cancel anytime" },
      { label: "Growth, not just visibility", note: "Content, promotion, optimisation" },
      { label: "Pay only when you sell", note: "Commission only on confirmed bookings" },
      { label: "Human support", note: "Fast, direct and ongoing" },
    ],
    ctaPrimary: "Become a partner",
    ctaSecondary: "Operator area",
    priceTitle: "How much does it cost?",
    subLabel: "Monthly subscription",
    perMonth: "/month",
    freeBadge: "3 months free",
    commissionLabel: "Commission per booking",
    commissionValue: "25%",
    commissionNote: "confirmed bookings only",
    premiumLabel: "Premium experiences (over €1,000)",
    premiumValue: "+ agreed flat fee",
    note: "No setup cost, cancel anytime. The displayed price already includes the Wondersun fee.",
  },
  footer: {
    tagline: "The digital concierge for authentic experiences in the Tuscan Maremma. From Argentario to Sorano — your tailor-made Local Escape.",
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
      terms: "Terms of Service",
      cookie: "Cookie Policy",
    },
  },
};

const DICTS: Record<Locale, Dictionary> = { it, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? it;
}
