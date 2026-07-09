import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { listExperiences } from "@/lib/data/experiences";
import type { ExperienceWithSupplier } from "@/lib/types";
import { checkRateLimit, rateLimitKeyFromRequest, RATE_LIMITS } from "@/lib/rate-limit";

const Input = z.object({
  message: z.string().min(1).max(1500),
});

/**
 * "Sole" · concierge digitale di Wondersun.
 *
 * Dato un messaggio del cliente (scritto o trascritto da vocale lato client),
 * suggerisce un set di esperienze del catalogo e risponde in modo amichevole.
 * Gestisce anche domande di assistenza sul funzionamento del portale.
 *
 * Motore di matching deterministico (funziona sempre, zero dipendenze). Se è
 * configurata ANTHROPIC_API_KEY la risposta testuale viene resa più naturale,
 * ma le esperienze proposte restano scelte dal matching per affidabilità.
 */

// Sinonimi/intenti → categorie e parole chiave del catalogo
const INTENT_MAP: { keywords: string[]; categories: string[] }[] = [
  {
    keywords: ["pesce", "mangiare", "ristorante", "cena", "pranzo", "cibo", "gastronom", "chef", "cucina"],
    categories: ["Enogastronomia"],
  },
  {
    keywords: ["vino", "cantina", "degustazione", "calice", "doc"],
    categories: ["Vino & Degustazioni"],
  },
  {
    keywords: ["mare", "barca", "vela", "snorkeling", "immersione", "sub", "yacht", "spiaggia", "tramonto", "navigazione", "costa", "isola"],
    categories: ["Mare & Costa"],
  },
  {
    keywords: ["cavallo", "equitazione", "natura", "trekking", "passeggiata", "butteri"],
    categories: ["Natura & Avventura"],
  },
  {
    keywords: ["bici", "ebike", "e-bike", "bicicletta", "sport", "avventura", "pedalata"],
    categories: ["Sport & Avventura"],
  },
  {
    keywords: ["storia", "cultura", "etrusch", "archeolog", "borghi", "necropoli", "arte", "museo"],
    categories: ["Cultura & Arte"],
  },
];

const AREA_KEYWORDS = ["argentario", "manciano", "sorano", "arcille", "orbetello", "pitigliano", "maremma", "porto santo stefano", "porto ercole"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

function scoreExperience(exp: ExperienceWithSupplier, text: string): number {
  const t = normalize(text);
  let score = 0;

  for (const intent of INTENT_MAP) {
    const hit = intent.keywords.some((k) => t.includes(k));
    if (hit && intent.categories.includes(exp.category)) score += 5;
  }

  // Match diretto su zona
  if (exp.location_area && t.includes(normalize(exp.location_area))) score += 3;
  if (exp.location_name && t.includes(normalize(exp.location_name))) score += 2;

  // Match su parole del titolo/descrizione
  const haystack = normalize(
    `${exp.title} ${exp.short_description ?? ""} ${exp.tag ?? ""} ${exp.category}`,
  );
  for (const word of t.split(/\s+/).filter((w) => w.length > 3)) {
    if (haystack.includes(word)) score += 1;
  }

  return score;
}

const HELP_INTENTS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["come funziona", "come prenot", "prenotazione", "prenotare"],
    answer:
      "Prenotare è semplice: scegli un'esperienza e invii la richiesta. Per le esperienze premium (es. uscite in barca o immersioni) il fornitore conferma la data o te ne propone una alternativa — resta tutto qui in piattaforma. Paghi online solo la quota Wondersun e saldi il resto direttamente al fornitore quando vivi l'esperienza.",
  },
  {
    keywords: ["pagamento", "pagare", "quanto pago", "prezzo", "costo"],
    answer:
      "Il prezzo che vedi è quello completo. Online versi soltanto la quota Wondersun (il concierge digitale): \"paghi solo quello che vivi\". Il resto lo paghi direttamente al fornitore sul posto. Per le esperienze premium il pagamento parte solo dopo la conferma del fornitore.",
  },
  {
    keywords: ["annull", "disdetta", "cancell", "rimborso"],
    answer:
      "Puoi annullare gratuitamente fino a 48 ore prima dell'esperienza. Trovi tutte le tue prenotazioni nell'area personale, con lo stato aggiornato in tempo reale.",
  },
  {
    keywords: ["fornitore", "diventare partner", "vendere", "iscrivere la mia attivit"],
    answer:
      "Vuoi proporre le tue esperienze? Registrati come fornitore: i primi 3 mesi sono gratuiti, poi il canone è di €29/mese. Gestisci esperienze e prenotazioni dalla tua dashboard e ricevi le richieste anche via WhatsApp.",
  },
];

function buildReply(suggestions: ExperienceWithSupplier[], helpAnswer: string | null): string {
  if (helpAnswer) {
    if (suggestions.length === 0) return helpAnswer;
    return `${helpAnswer}\n\nIntanto, qualche idea che potrebbe piacerti qui sotto. ☀️`;
  }
  if (suggestions.length === 0) {
    return "Raccontami cosa ti piacerebbe vivere: mare e barca a vela, una cena di pesce, vino in cantina, cavallo nella Maremma o i borghi etruschi? Ti propongo le esperienze giuste per te. ☀️";
  }
  return "Ho qualche idea perfetta per te! ☀️ Dai un'occhiata qui sotto — da ogni scheda invii una richiesta singola al fornitore, scegliendo data e persone.";
}

async function enhanceReply(
  userMessage: string,
  baseReply: string,
  suggestions: ExperienceWithSupplier[],
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return baseReply;
  try {
    const list = suggestions
      .map((s) => `- ${s.title} (${s.category}, ${s.location_area})`)
      .join("\n");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system:
          "Sei Sole, la concierge digitale di Wondersun, piattaforma di esperienze nella Maremma Toscana e Costa d'Argento. Tono caldo, amichevole, conciso (max 3 frasi), in italiano. Non inventare esperienze: parla solo di quelle elencate. Non chiedere dati personali.",
        messages: [
          {
            role: "user",
            content: `Messaggio del cliente: "${userMessage}"\n\nEsperienze da proporre:\n${list || "(nessuna)"}\n\nScrivi una risposta breve e calorosa che introduca queste esperienze.`,
          },
        ],
      }),
    });
    if (!res.ok) return baseReply;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" && text.trim() ? text.trim() : baseReply;
  } catch {
    return baseReply;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rl = checkRateLimit(rateLimitKeyFromRequest(request, "sole"), RATE_LIMITS.chatbot);
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "Troppe richieste al chatbot. Riprova tra qualche minuto.",
          retryAfterMs: rl.retryAfterMs,
        },
        { status: 429, headers: { "retry-after": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    const { message } = Input.parse(await request.json());
    const t = normalize(message);

    const helpAnswer =
      HELP_INTENTS.find((h) => h.keywords.some((k) => t.includes(normalize(k))))?.answer ?? null;

    const catalog = await listExperiences({});

    const scored = catalog
      .map((exp) => ({ exp, score: scoreExperience(exp, message) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Se nessun match ma il cliente non sta facendo una domanda di assistenza,
    // proponi comunque le più popolari come spunto.
    let picks = scored.slice(0, 3).map((s) => s.exp);
    if (picks.length === 0 && !helpAnswer) {
      picks = [...catalog]
        .sort((a, b) => b.bookings_count - a.bookings_count)
        .slice(0, 3);
    }

    const baseReply = buildReply(picks, helpAnswer);
    const reply = await enhanceReply(message, baseReply, picks);

    return NextResponse.json({
      reply,
      suggestions: picks.map((e) => ({
        slug: e.slug,
        title: e.title,
        category: e.category,
        location_area: e.location_area,
        price_cents: e.price_cents,
        cover_image_url: e.cover_image_url,
        requires_request: e.requires_request,
        supplier: e.supplier?.business_name ?? null,
      })),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Messaggio non valido" }, { status: 400 });
    }
    return NextResponse.json({ error: "Errore" }, { status: 500 });
  }
}
