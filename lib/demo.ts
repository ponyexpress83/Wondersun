import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export type DemoRole = "cliente" | "fornitore" | "admin";

export interface DemoAccount {
  role: DemoRole;
  email: string;
  password: string;
  fullName: string;
  title: string;
  description: string;
  redirectTo: string;
  highlights: string[];
}

export const DEMO_PASSWORD = "WondersunDemo2026!";

export const DEMO_ACCOUNTS: Record<DemoRole, DemoAccount> = {
  cliente: {
    role: "cliente",
    email: "demo.cliente@wondersun.it",
    password: DEMO_PASSWORD,
    fullName: "Cliente Demo",
    title: "Cliente",
    description:
      "Naviga il catalogo, invia una richiesta di prenotazione singola e gestisci le tue prenotazioni.",
    redirectTo: "/dashboard",
    highlights: [
      "Catalogo + scheda esperienza con breakdown prezzo",
      "Richiesta prenotazione (premium “a richiesta”)",
      "Ogni richiesta è singola, verso un solo fornitore",
    ],
  },
  fornitore: {
    role: "fornitore",
    email: "demo.fornitore@wondersun.it",
    password: DEMO_PASSWORD,
    fullName: "Fornitore Demo",
    title: "Fornitore (approvato)",
    description:
      "Account già approvato con esperienze pubblicate: vedi le richieste in arrivo, conferma, proponi una data alternativa o rifiuta.",
    redirectTo: "/fornitore/dashboard",
    highlights: [
      "Dashboard con KPI e banner stato abbonamento",
      "Gestione richieste: conferma / proponi data alternativa / rifiuta",
      "Schede curate dallo staff Wondersun (sola lettura per il fornitore)",
      "Notifiche prenotazione in arrivo (best-effort WhatsApp + email)",
    ],
  },
  admin: {
    role: "admin",
    email: "demo.admin@wondersun.it",
    password: DEMO_PASSWORD,
    fullName: "Admin Demo",
    title: "Admin Wondersun",
    description:
      "Pannello completo: modera fornitori, esperienze, prenotazioni e utenti con email di esito automatica.",
    redirectTo: "/admin",
    highlights: [
      "Fornitori: approva / rifiuta / sospendi con motivazione",
      "Esperienze e prenotazioni con KPI commissioni",
      "Email + WhatsApp di esito moderazione fornitore",
    ],
  },
};

export function isDemoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Garantisce che l'account demo per il ruolo richiesto esista, sia configurato
 * correttamente e (per il fornitore) abbia un'esperienza pubblicata da mostrare.
 * Idempotente: si può richiamare a ogni login senza creare duplicati.
 */
export async function provisionDemoAccount(role: DemoRole): Promise<{ userId: string }> {
  const account = DEMO_ACCOUNTS[role];
  const admin = createSupabaseAdminClient();

  const userId = await ensureAuthUser(admin, account);
  await ensureProfile(admin, userId, account);

  if (role === "fornitore") {
    await ensureMontautoSupplier(admin, userId);
  }

  return { userId };
}

async function ensureAuthUser(admin: ReturnType<typeof createSupabaseAdminClient>, account: DemoAccount): Promise<string> {
  const created = await admin.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { full_name: account.fullName, role: account.role },
  });

  if (created.data?.user) return created.data.user.id;

  const message = created.error?.message?.toLowerCase() ?? "";
  const alreadyExists =
    message.includes("already") || message.includes("registered") || message.includes("exists");
  if (!alreadyExists) {
    throw new Error(`createUser fallito per ${account.email}: ${created.error?.message ?? "errore sconosciuto"}`);
  }

  // Utente demo già esistente: lookup VELOCE e indicizzato sulla tabella profiles
  // (creata al primo provisioning con la stessa email). Evita la scansione di
  // TUTTI gli auth users via listUsers — era la causa della lentezza/intermittenza
  // del login Fornitore, che faceva due scansioni complete (fornitore + vetrina).
  // La password è fissa (DEMO_PASSWORD, impostata alla creazione), quindi non serve
  // resettarla a ogni login.
  const { data: prof } = await admin
    .from("profiles")
    .select("id")
    .eq("email", account.email)
    .maybeSingle();
  if (prof?.id) return prof.id as string;

  // Fallback raro (utente auth senza profilo): scansione paginata.
  let page = 1;
  while (page < 20) {
    const list = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (list.error) throw new Error(`listUsers fallito: ${list.error.message}`);
    const found = list.data.users.find(
      (u: { id: string; email?: string | null }) =>
        u.email?.toLowerCase() === account.email.toLowerCase(),
    );
    if (found) return found.id;
    if (list.data.users.length < 200) break;
    page += 1;
  }
  throw new Error(`Utente demo ${account.email} non trovato dopo createUser idempotente`);
}

async function ensureProfile(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
  account: DemoAccount,
): Promise<void> {
  const role: UserRole = account.role;
  const { error } = await admin
    .from("profiles")
    .upsert(
      { id: userId, email: account.email, full_name: account.fullName, role },
      { onConflict: "id" },
    );
  if (error) throw new Error(`upsert profilo demo fallito: ${error.message}`);
}

// ── Fonte di verità: fornitore demo REALE = Tenuta Montauto ──────────────────
// Allineato ai dati già in produzione (Supabase). Il provisioning è idempotente:
// aggiorna l'anagrafica del fornitore ai valori reali e inserisce le 4 esperienze
// solo se mancano (NON sovrascrive eventuali modifiche fatte a mano in prod).
const COVER_BASE =
  "https://ipunxusmsdsuzfqnbpum.supabase.co/storage/v1/object/public/experience-covers";

const MONTAUTO_SUPPLIER = {
  business_name: "Tenuta Montauto",
  vat_number: "01259100533",
  registered_office: "Località Montauto, 58011 Capalbio (GR)",
  city: "Capalbio",
  province: "GR",
  postal_code: "58011",
  description:
    "Tenuta Montauto — azienda vitivinicola biologica a Capalbio, sulla Costa d'Argento. Degustazioni in cantina e barricaia tra i vigneti dell'Argentario.",
  contact_email: "demo.fornitore@wondersun.it",
  contact_phone: "+393793785317",
  mode: "prenotabile",
  status: "approvato",
  subscription_status: "trial",
};

const MONTAUTO_EXPERIENCES = [
  {
    slug: "montauto-degustazione-light",
    title: "Degustazione Light",
    short_description: "Visita alla cantina e alla barricaia con degustazione di 3 vini.",
    description:
      "Un primo assaggio della Tenuta Montauto: visita guidata alla cantina e alla barricaia e degustazione di tre nostri vini.",
    price_cents: 2500,
    duration_label: "1 ora",
    duration_hours: 1,
    cover_image_url: `${COVER_BASE}/cover-light.jpg`,
  },
  {
    slug: "montauto-degustazione-classica",
    title: "Degustazione Classica",
    short_description:
      "Tour guidato di cantina e barricaia, 4 vini e olio EVO biologico IGP Toscano.",
    description:
      "Tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini e del nostro olio extravergine di oliva biologico IGP Toscano.",
    price_cents: 4000,
    duration_label: "1 ora e 30",
    duration_hours: 1.5,
    cover_image_url: `${COVER_BASE}/cover-classica.jpg`,
  },
  {
    slug: "montauto-degustazione-montauto",
    title: "Degustazione Montauto",
    short_description:
      "Tour guidato, 4 vini, olio EVO bio e tagliere di salumi e formaggi locali.",
    description:
      "Tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini e di olio extravergine biologico IGP Toscano, con tagliere di salumi e formaggi locali accompagnato da bruschette.",
    price_cents: 5000,
    duration_label: "1 ora e 30",
    duration_hours: 1.5,
    cover_image_url: `${COVER_BASE}/cover-montauto.jpg`,
  },
  {
    slug: "montauto-country-tasting",
    title: "Country Tasting",
    short_description: "Safari tra i vigneti, tour, 4 vini + 1 cru, olio EVO e tagliere.",
    description:
      "L'esperienza più completa: safari in fuoristrada tra i vigneti, tour guidato della cantina e della barricaia con illustrazione dei principi di vinificazione e della filosofia di Montauto. Degustazione di quattro vini più un cru o una vecchia annata, olio extravergine biologico IGP Toscano e tagliere di salumi e formaggi locali con bruschette.",
    price_cents: 7500,
    duration_label: "2 ore e 30",
    duration_hours: 2.5,
    cover_image_url: `${COVER_BASE}/cover-country.jpg`,
  },
];

async function ensureMontautoSupplier(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  profileId: string,
): Promise<void> {
  const { data: existing, error: readErr } = await admin
    .from("suppliers")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (readErr) throw new Error(`lettura supplier demo fallita: ${readErr.message}`);

  const supplierData = {
    profile_id: profileId,
    ...MONTAUTO_SUPPLIER,
    status_notes: "Account demo — Tenuta Montauto (auto-approvato)",
    approved_at: new Date().toISOString(),
  };

  let supplierId: string;
  if (existing) {
    supplierId = existing.id;
    // IMPORTANTE: se il fornitore esiste già NON si toccano i dati anagrafici.
    // L'amministratrice può modificarli dal pannello (nome, descrizione, sede,
    // contatti) e un successivo accesso demo non deve sovrascriverli.
    // Si allineano solo stato e abbonamento, che servono a tenere l'account
    // demo utilizzabile.
    await admin
      .from("suppliers")
      .update({
        status: "approvato",
        subscription_status: "trial",
        approved_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    // Short-circuit: se le 4 esperienze reali ci sono già, evita lavoro inutile
    // a ogni login demo (era una delle cause della lentezza del fornitore).
    const { count } = await admin
      .from("experiences")
      .select("id", { count: "exact", head: true })
      .eq("supplier_id", supplierId)
      .in(
        "slug",
        MONTAUTO_EXPERIENCES.map((e) => e.slug),
      );
    if ((count ?? 0) >= MONTAUTO_EXPERIENCES.length) return;
  } else {
    const inserted = await admin
      .from("suppliers")
      .insert(supplierData)
      .select("id")
      .single();
    if (inserted.error || !inserted.data) {
      throw new Error(`insert supplier demo fallito: ${inserted.error?.message}`);
    }
    supplierId = inserted.data.id;
  }

  // Inserisci le 4 esperienze solo se il loro slug non esiste già (idempotente,
  // non sovrascrive i dati reali di Montauto in produzione).
  for (const exp of MONTAUTO_EXPERIENCES) {
    const { data: expExisting } = await admin
      .from("experiences")
      .select("id")
      .eq("slug", exp.slug)
      .maybeSingle();
    if (expExisting) continue;
    const { error } = await admin.from("experiences").insert({
      supplier_id: supplierId,
      ...exp,
      category: "Enogastronomia",
      location_name: "Capalbio",
      location_area: "Manciano",
      price_type: "pro_capite",
      min_participants: 2,
      max_participants: 10,
      requires_request: true,
      is_bookable: true,
      status: "pubblicata",
    });
    if (error) throw new Error(`insert esperienza Montauto demo fallita: ${error.message}`);
  }
}
