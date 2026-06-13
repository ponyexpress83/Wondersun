import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Carica Tenuta Montauto (degustazioni di vino · Manciano) come fornitore
 * d'esempio reale, con le 4 esperienze del listino ufficiale. Idempotente.
 * Serve a mostrare alla committente come si presenta un fornitore completo
 * e a dimostrare il flusso di onboarding gestito dall'admin.
 */

const LOGIN_EMAIL = "tenuta.montauto@wondersun.it";

const COVER =
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80&auto=format&fit=crop";

const EXPERIENCES = [
  {
    slug: "montauto-light-tasting",
    title: "Light Tasting · Tenuta Montauto",
    short_description:
      "Visita alla cantina e alla barricaia con degustazione di 3 vini. 45 minuti tra le botti di Montauto.",
    description:
      "Un primo assaggio della filosofia Montauto: visita alla cantina e alla barricaia con degustazione di tre vini della tenuta. Il terroir argilloso e ricco di minerali, accarezzato dalle brezze del mare di Capalbio, dà vita a grandi bianchi — su tutti il Sauvignon. Durata circa 45 minuti.",
    duration_label: "45 minuti",
    duration_hours: 0.75,
    price_cents: 2500,
    tag: "Novità",
    cover_image_url:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "montauto-classic-tasting",
    title: "Classic Tasting · Tenuta Montauto",
    short_description:
      "Tour guidato di cantina e barricaia, degustazione di 4 vini e olio EVO Bio IGP Toscano. 1h30.",
    description:
      "Visita guidata alla cantina e alla barricaia con descrizione dei principi, della filosofia e delle scelte di vinificazione di Tenuta Montauto. Degustazione di 4 vini e assaggio dell'Olio Extra Vergine Biologico IGP Toscano della tenuta. Durata circa un'ora e mezza.",
    duration_label: "1 ora e 30",
    duration_hours: 1.5,
    price_cents: 4000,
    tag: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "montauto-montauto-tasting",
    title: "Montauto Tasting · degustazione con tagliere",
    short_description:
      "Tour guidato, 4 vini, olio EVO Bio e tagliere di salumi e formaggi locali. 1h30.",
    description:
      "L'esperienza più amata: visita guidata alla cantina e alla barricaia con racconto della filosofia e delle scelte di vinificazione, degustazione di 4 vini, assaggio dell'Olio EVO Biologico IGP Toscano e tagliere con formaggi e salumi locali. Da gustare nella nuova sala degustazioni o nell'elegante dehor immerso nella natura. Durata circa un'ora e mezza.",
    duration_label: "1 ora e 30",
    duration_hours: 1.5,
    price_cents: 5000,
    tag: "Più Prenotata",
    cover_image_url: COVER,
  },
  {
    slug: "montauto-country-experience",
    title: "Country Experience · safari tra i vigneti",
    short_description:
      "Tour in fuoristrada nei vigneti, 4 vini + 1 Cru, olio EVO Bio e tagliere locale. 2h30.",
    description:
      "L'esperienza completa di Tenuta Montauto: tour in fuoristrada tra i vigneti, visita guidata di cantina e barricaia, degustazione di 4 vini più 1 Cru o vecchia annata, assaggio dell'Olio EVO Biologico IGP Toscano e tagliere con formaggi e salumi locali. Un'immersione totale nel terroir della Maremma tra Saturnia e Capalbio. Durata circa due ore e mezza.",
    duration_label: "2 ore e 30",
    duration_hours: 2.5,
    price_cents: 7500,
    tag: "Esclusivo",
    cover_image_url:
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80&auto=format&fit=crop",
  },
];

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin" ? user : null;
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Riservato admin" }, { status: 403 });

  const db = createSupabaseAdminClient();

  try {
    // 1) Account auth fornitore
    let userId: string;
    const created = await db.auth.admin.createUser({
      email: LOGIN_EMAIL,
      password: `Montauto${Math.random().toString(36).slice(2, 8)}!`,
      email_confirm: true,
      user_metadata: { full_name: "Tenuta Montauto", role: "fornitore" },
    });
    if (created.data?.user) {
      userId = created.data.user.id;
    } else {
      const list = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = list.data.users.find(
        (u: { id: string; email?: string | null }) =>
          u.email?.toLowerCase() === LOGIN_EMAIL,
      );
      if (!found) return NextResponse.json({ error: "Account Montauto non creabile" }, { status: 500 });
      userId = found.id;
    }

    await db.from("profiles").upsert(
      { id: userId, email: LOGIN_EMAIL, full_name: "Tenuta Montauto", role: "fornitore" },
      { onConflict: "id" },
    );

    // 2) Supplier
    const supplierData = {
      profile_id: userId,
      business_name: "Tenuta Montauto",
      description:
        "Tenuta Montauto appartiene alla famiglia Lepri da oltre sessant'anni. Nel cuore della Maremma Toscana, tra Saturnia e Capalbio, produce grandi vini su un terroir argilloso e ricco di minerali — in particolare Sauvignon e Pinot Nero. Degustazioni nella nuova sala e nel dehor immerso nella natura.",
      city: "Manciano",
      province: "GR",
      contact_email: "hospitality.tenutamontauto@gmail.com",
      contact_phone: "+39 0564 384521",
      website: "https://www.tenutamontauto.com",
      mode: "prenotabile" as const,
      is_founding_partner: true,
      status: "approvato" as const,
      approved_at: new Date().toISOString(),
      approved_by: admin.id,
      subscription_status: "trial" as const,
    };
    const { data: existing } = await db
      .from("suppliers")
      .select("id")
      .eq("profile_id", userId)
      .maybeSingle();

    let supplierId: string;
    if (existing) {
      await db.from("suppliers").update(supplierData).eq("id", existing.id);
      supplierId = existing.id;
    } else {
      const ins = await db.from("suppliers").insert(supplierData).select("id").single();
      if (ins.error || !ins.data) {
        return NextResponse.json({ error: ins.error?.message }, { status: 400 });
      }
      supplierId = ins.data.id;
    }

    // 3) Esperienze (le degustazioni del listino)
    let createdCount = 0;
    for (const exp of EXPERIENCES) {
      const { data: expExisting } = await db
        .from("experiences")
        .select("id")
        .eq("slug", exp.slug)
        .maybeSingle();
      if (expExisting) {
        await db
          .from("experiences")
          .update({ price_cents: exp.price_cents, status: "pubblicata" })
          .eq("id", expExisting.id);
        continue;
      }
      const { error } = await db.from("experiences").insert({
        supplier_id: supplierId,
        slug: exp.slug,
        title: exp.title,
        short_description: exp.short_description,
        description: exp.description,
        category: "Vino & Degustazioni",
        tag: exp.tag,
        tag_color: "#7B2D43",
        duration_label: exp.duration_label,
        duration_hours: exp.duration_hours,
        min_participants: 2,
        max_participants: 12,
        price_cents: exp.price_cents,
        price_type: "pro_capite",
        location_name: "Manciano",
        location_area: "Manciano",
        cover_image_url: exp.cover_image_url,
        requires_request: true,
        is_bookable: true,
        status: "pubblicata",
        rating: 4.9,
        reviews_count: 26,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      createdCount += 1;
    }

    await logAudit({
      actorId: admin.id,
      action: "admin.seed.montauto",
      entityType: "supplier",
      entityId: supplierId,
      metadata: { experiences_created: createdCount },
    });

    return NextResponse.json({ supplierId, experiencesCreated: createdCount });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
