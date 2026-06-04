import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeCommission } from "@/lib/types";
import { generateBookingCode } from "@/lib/utils";
import { notifySupplierNewBooking } from "@/lib/notify";

interface RouteContext {
  params: { id: string };
}

const PatchInput = z.object({ action: z.literal("submit") });

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    PatchInput.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

    const { data: pkg } = await supabase
      .from("packages")
      .select("id, client_id, status")
      .eq("id", params.id)
      .maybeSingle();
    if (!pkg || pkg.client_id !== user.id) {
      return NextResponse.json({ error: "Pacchetto non trovato" }, { status: 404 });
    }
    if (pkg.status !== "bozza") {
      return NextResponse.json({ error: "Pacchetto già inviato" }, { status: 400 });
    }

    const { data: items = [] } = await supabase
      .from("package_items")
      .select(
        "id, requested_date, participants, experience:experiences(id, title, supplier_id, price_cents, status, min_participants, max_participants, requires_request)",
      )
      .eq("package_id", pkg.id);

    if ((items as any[]).length === 0) {
      return NextResponse.json({ error: "Il pacchetto è vuoto" }, { status: 400 });
    }

    // Validazione di tutte le voci prima di creare qualsiasi prenotazione.
    for (const it of items as any[]) {
      const exp = it.experience;
      if (!exp || exp.status !== "pubblicata") {
        return NextResponse.json(
          { error: `"${exp?.title ?? "Esperienza"}" non è più disponibile: rimuovila dal pacchetto.` },
          { status: 400 },
        );
      }
      if (!it.requested_date) {
        return NextResponse.json(
          { error: `Scegli una data per "${exp.title}".` },
          { status: 400 },
        );
      }
      if (it.participants < exp.min_participants || it.participants > exp.max_participants) {
        return NextResponse.json(
          {
            error: `Partecipanti fuori dai limiti per "${exp.title}" (${exp.min_participants}–${exp.max_participants}).`,
          },
          { status: 400 },
        );
      }
    }

    const rows = (items as any[]).map((it) => {
      const exp = it.experience;
      const unit = exp.price_cents;
      const total = unit * it.participants;
      const breakdown = computeCommission(total);
      const requiresRequest = Boolean(exp.requires_request);
      return {
        booking_code: generateBookingCode(),
        client_id: user.id,
        experience_id: exp.id,
        supplier_id: exp.supplier_id,
        requested_date: it.requested_date,
        participants: it.participants,
        status: requiresRequest ? "richiesta" : "confermata",
        responded_at: requiresRequest ? null : new Date().toISOString(),
        unit_price_cents: unit,
        total_cents: total,
        commission_pct: breakdown.commission_pct,
        commission_cents: breakdown.commission_cents,
        supplier_payout_cents: breakdown.supplier_payout_cents,
        high_value_fee_cents: breakdown.high_value_fee_cents,
        package_id: pkg.id,
      };
    });

    const { data: created, error: insErr } = await supabase
      .from("bookings")
      .insert(rows)
      .select("id, booking_code, supplier_id, experience_id, requested_date, participants");
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 });

    await supabase.from("packages").update({ status: "inviato" }).eq("id", pkg.id);

    // Notifica i fornitori coinvolti (email + WhatsApp, best-effort).
    const supplierIds = Array.from(new Set(rows.map((r) => r.supplier_id)));
    const { data: contacts = [] } = await supabase
      .from("suppliers")
      .select("id, contact_email, contact_phone")
      .in("id", supplierIds);
    const contactMap = new Map((contacts as any[]).map((c) => [c.id, c]));
    const expById = new Map((items as any[]).map((it) => [it.experience.id, it.experience]));

    await Promise.allSettled(
      (created as any[]).map((b) => {
        const contact = contactMap.get(b.supplier_id);
        if (!contact) return Promise.resolve();
        const exp = expById.get(b.experience_id);
        return notifySupplierNewBooking(
          { email: contact.contact_email, whatsapp: contact.contact_phone },
          {
            bookingCode: b.booking_code,
            experienceTitle: exp?.title ?? "Esperienza",
            requestedDate: b.requested_date,
            participants: b.participants,
            requiresRequest: Boolean(exp?.requires_request),
          },
        );
      }),
    );

    return NextResponse.json({ count: (created as any[]).length });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  const { data: pkg } = await supabase
    .from("packages")
    .select("id, client_id, status")
    .eq("id", params.id)
    .maybeSingle();
  if (!pkg || pkg.client_id !== user.id) {
    return NextResponse.json({ error: "Pacchetto non trovato" }, { status: 404 });
  }
  if (pkg.status !== "bozza") {
    return NextResponse.json(
      { error: "Un pacchetto già inviato non può essere eliminato" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("packages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
