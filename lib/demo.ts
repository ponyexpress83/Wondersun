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
      "Naviga il catalogo, invia una richiesta di prenotazione e componi un pacchetto multi-esperienza.",
    redirectTo: "/dashboard",
    highlights: [
      "Catalogo + scheda esperienza con breakdown prezzo",
      "Richiesta prenotazione (premium “a richiesta”)",
      "Carrello pacchetti → N prenotazioni indipendenti",
    ],
  },
  fornitore: {
    role: "fornitore",
    email: "demo.fornitore@wondersun.it",
    password: DEMO_PASSWORD,
    fullName: "Fornitore Demo",
    title: "Fornitore (approvato)",
    description:
      "Account già approvato con un'esperienza pubblicata: vedi le richieste in arrivo, conferma o proponi data alternativa.",
    redirectTo: "/fornitore/dashboard",
    highlights: [
      "Dashboard con KPI e banner stato abbonamento",
      "CRUD esperienze e moderazione richieste",
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
    await ensureSupplierWithExperience(admin, userId);
    // Le due schede vetrina d'esempio (omaggio concordato con la committente 05/06):
    // un agriturismo e un ristorante in modalità "contatto diretto".
    await ensureVetrinaShowcase(admin);
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

  let page = 1;
  while (page < 20) {
    const list = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (list.error) throw new Error(`listUsers fallito: ${list.error.message}`);
    const found = list.data.users.find(
      (u: { id: string; email?: string | null }) =>
        u.email?.toLowerCase() === account.email.toLowerCase(),
    );
    if (found) {
      await admin.auth.admin.updateUserById(found.id, { password: account.password, email_confirm: true });
      return found.id;
    }
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

async function ensureSupplierWithExperience(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  profileId: string,
): Promise<void> {
  const { data: existing, error: readErr } = await admin
    .from("suppliers")
    .select("id, status, subscription_status")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (readErr) throw new Error(`lettura supplier demo fallita: ${readErr.message}`);

  let supplierId: string;
  if (existing) {
    supplierId = existing.id;
    await admin
      .from("suppliers")
      .update({
        status: "approvato",
        subscription_status: "trial",
        status_notes: "Account demo — auto-approvato",
        approved_at: new Date().toISOString(),
      })
      .eq("id", supplierId);
  } else {
    const inserted = await admin
      .from("suppliers")
      .insert({
        profile_id: profileId,
        business_name: "Tramonti Maremma · Demo",
        vat_number: "IT00000000000",
        registered_office: "Via del Porto 1, Porto Ercole",
        city: "Porto Ercole",
        province: "GR",
        postal_code: "58018",
        description:
          "Operatore demo per la presentazione Wondersun. Esperienze sulla Costa d'Argento.",
        contact_email: "demo.fornitore@wondersun.it",
        contact_phone: "+39 000 0000000",
        status: "approvato",
        status_notes: "Account demo — auto-approvato",
        approved_at: new Date().toISOString(),
        subscription_status: "trial",
      })
      .select("id")
      .single();
    if (inserted.error || !inserted.data) {
      throw new Error(`insert supplier demo fallito: ${inserted.error?.message}`);
    }
    supplierId = inserted.data.id;
  }

  const slug = "tramonto-in-barca-argentario-demo";
  const { data: expExisting } = await admin
    .from("experiences")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!expExisting) {
    const { error: expErr } = await admin.from("experiences").insert({
      supplier_id: supplierId,
      slug,
      title: "Tramonto in barca all'Argentario",
      short_description: "2 ore di navigazione tra Porto Ercole e Cala Galera con calice di vermentino.",
      description:
        "Salpiamo al pomeriggio dal porto di Cala Galera e costeggiamo la Rocca aldobrandesca fino a vivere il tramonto da mare aperto. A bordo skipper locale, calice di vermentino e taglierino tipico maremmano. Esperienza pensata per coppie e piccoli gruppi.",
      category: "Mare & Costa",
      tag: "Più Prenotata",
      duration_label: "2 ore",
      duration_hours: 2,
      min_participants: 2,
      max_participants: 6,
      price_cents: 9000,
      price_type: "pro_capite",
      location_name: "Porto Ercole",
      location_area: "Argentario",
      requires_request: true,
      status: "pubblicata",
    });
    if (expErr) throw new Error(`insert esperienza demo fallita: ${expErr.message}`);
  }
}

/**
 * Due schede vetrina d'esempio (omaggio 05/06): fornitore in modalità
 * "vetrina" con agriturismo e ristorante a contatto diretto. Idempotente.
 */
async function ensureVetrinaShowcase(
  admin: ReturnType<typeof createSupabaseAdminClient>,
): Promise<void> {
  const account: DemoAccount = {
    role: "fornitore",
    email: "demo.vetrina@wondersun.it",
    password: DEMO_PASSWORD,
    fullName: "Vetrina Demo",
    title: "Vetrina",
    description: "",
    redirectTo: "/fornitore/dashboard",
    highlights: [],
  };
  const userId = await ensureAuthUser(admin, account);
  await ensureProfile(admin, userId, account);

  const { data: existing } = await admin
    .from("suppliers")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  let supplierId: string;
  if (existing) {
    supplierId = existing.id;
    await admin
      .from("suppliers")
      .update({ mode: "vetrina", status: "approvato" })
      .eq("id", supplierId);
  } else {
    const inserted = await admin
      .from("suppliers")
      .insert({
        profile_id: userId,
        business_name: "Maremma Ospitalità · Demo",
        city: "Manciano",
        province: "GR",
        description:
          "Struttura dimostrativa in modalità vetrina: i clienti contattano direttamente la struttura.",
        contact_email: "demo.vetrina@wondersun.it",
        contact_phone: "+39 0564 000000",
        website: "https://example.com",
        mode: "vetrina",
        status: "approvato",
        status_notes: "Account demo vetrina — auto-approvato",
        approved_at: new Date().toISOString(),
        subscription_status: "trial",
      })
      .select("id")
      .single();
    if (inserted.error || !inserted.data) {
      throw new Error(`insert supplier vetrina demo fallito: ${inserted.error?.message}`);
    }
    supplierId = inserted.data.id;
  }

  const schede = [
    {
      slug: "agriturismo-le-querce-maremma-demo",
      title: "Agriturismo Le Querce di Maremma",
      short_description:
        "Camere e colazione contadina tra gli ulivi di Manciano. Contatto diretto con la struttura.",
      description:
        "Casale dell'Ottocento ristrutturato tra le colline di Manciano: sette camere, piscina panoramica, colazione con prodotti dell'azienda agricola. Prenotazione e disponibilità direttamente con la struttura — telefono, WhatsApp o sito ufficiale.",
      category: "Natura & Avventura",
      location_name: "Manciano",
      location_area: "Manciano",
      price_cents: 0,
    },
    {
      slug: "osteria-del-porto-demo",
      title: "Osteria del Porto · cucina di mare",
      short_description:
        "Pescato del giorno e vermentino a Porto Santo Stefano. Prenota direttamente al telefono.",
      description:
        "Osteria storica sul porto: crudo di pesce locale, spaghetti alle vongole veraci e la cantina di vermentini della Costa d'Argento. Tavoli limitati: la prenotazione avviene direttamente con il ristorante via telefono o WhatsApp.",
      category: "Enogastronomia",
      location_name: "Porto Santo Stefano",
      location_area: "Argentario",
      price_cents: 0,
    },
  ];

  for (const scheda of schede) {
    const { data: expExisting } = await admin
      .from("experiences")
      .select("id")
      .eq("slug", scheda.slug)
      .maybeSingle();
    if (expExisting) continue;
    const { error } = await admin.from("experiences").insert({
      supplier_id: supplierId,
      ...scheda,
      duration_label: null,
      min_participants: 1,
      max_participants: 99,
      price_type: "gruppo",
      requires_request: false,
      is_bookable: false,
      status: "pubblicata",
    });
    if (error) throw new Error(`insert scheda vetrina demo fallita: ${error.message}`);
  }
}
