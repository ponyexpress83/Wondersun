import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeCommission } from "@/lib/types";
import { generateBookingCode } from "@/lib/utils";
import { notifySupplierNewBooking } from "@/lib/notify";

const BookingInput = z.object({
  experienceId: z.string().uuid(),
  requestedDate: z.string(),
  participants: z.number().int().min(1),
  notes: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = BookingInput.parse(body);

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Devi essere loggato" }, { status: 401 });

    const { data: experience, error: expError } = await supabase
      .from("experiences")
      .select(
        "id, title, supplier_id, price_cents, status, min_participants, max_participants, requires_request",
      )
      .eq("id", data.experienceId)
      .single();
    if (expError || !experience) {
      return NextResponse.json({ error: "Esperienza non trovata" }, { status: 404 });
    }
    if (experience.status !== "pubblicata") {
      return NextResponse.json({ error: "Esperienza non disponibile" }, { status: 400 });
    }
    if (
      data.participants < experience.min_participants ||
      data.participants > experience.max_participants
    ) {
      return NextResponse.json(
        {
          error: `Numero partecipanti fuori dai limiti consentiti (${experience.min_participants}–${experience.max_participants})`,
        },
        { status: 400 },
      );
    }

    const unit = experience.price_cents;
    const total = unit * data.participants;
    const breakdown = computeCommission(total);

    // Esperienze "a richiesta": il fornitore deve confermare → stato "richiesta".
    // Esperienze a prenotazione diretta: confermate subito, pronte al pagamento.
    const requiresRequest = Boolean(experience.requires_request);
    const initialStatus = requiresRequest ? "richiesta" : "confermata";

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        booking_code: generateBookingCode(),
        client_id: user.id,
        experience_id: experience.id,
        supplier_id: experience.supplier_id,
        requested_date: data.requestedDate,
        participants: data.participants,
        notes: data.notes ?? null,
        status: initialStatus,
        responded_at: requiresRequest ? null : new Date().toISOString(),
        unit_price_cents: unit,
        total_cents: total,
        commission_pct: breakdown.commission_pct,
        commission_cents: breakdown.commission_cents,
        supplier_payout_cents: breakdown.supplier_payout_cents,
        high_value_fee_cents: breakdown.high_value_fee_cents,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Notifica al fornitore (email + WhatsApp, best-effort)
    const { data: supplierContact } = await supabase
      .from("suppliers")
      .select("contact_email, contact_phone")
      .eq("id", experience.supplier_id)
      .maybeSingle();
    if (supplierContact) {
      await notifySupplierNewBooking(
        { email: supplierContact.contact_email, whatsapp: supplierContact.contact_phone },
        {
          bookingCode: booking.booking_code,
          experienceTitle: experience.title,
          requestedDate: data.requestedDate,
          participants: data.participants,
          requiresRequest,
        },
      );
    }

    return NextResponse.json({ booking, requiresRequest });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore" },
      { status: 500 },
    );
  }
}
