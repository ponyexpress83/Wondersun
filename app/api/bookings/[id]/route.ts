import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CANCELLATION_HOURS } from "@/lib/types";
import { notifyClientBookingUpdate } from "@/lib/notify";

interface RouteContext {
  params: { id: string };
}

const ActionInput = z.object({
  action: z.enum([
    "conferma",
    "rifiuta",
    "proponi_alternativa",
    "accetta_alternativa",
    "annulla",
  ]),
  alternativeDate: z.string().optional().nullable(),
  // Motivo predefinito del rifiuto — niente testo libero per evitare scambio
  // di contatti fuori piattaforma (call 23/05/2026).
  reason: z
    .enum(["non_disponibile", "meteo", "capienza", "altro"])
    .optional()
    .nullable(),
});

const REASON_LABELS: Record<string, string> = {
  non_disponibile: "Data non disponibile",
  meteo: "Condizioni meteo non idonee",
  capienza: "Capienza esaurita",
  altro: "Non disponibile",
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const input = ActionInput.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select(
        "*, experience:experiences(title), supplier:suppliers(profile_id), client:profiles!bookings_client_id_fkey(email, phone)",
      )
      .eq("id", params.id)
      .single();
    if (bErr || !booking) {
      return NextResponse.json({ error: "Prenotazione non trovata" }, { status: 404 });
    }

    const isSupplier = (booking as any).supplier?.profile_id === user.id;
    const isClient = booking.client_id === user.id;
    if (!isSupplier && !isClient) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const update: Record<string, unknown> = {};
    let notifyStatus: string | null = null;

    switch (input.action) {
      case "conferma":
      case "rifiuta":
      case "proponi_alternativa": {
        if (!isSupplier) {
          return NextResponse.json({ error: "Azione riservata al fornitore" }, { status: 403 });
        }
        if (!["richiesta", "data_alternativa"].includes(booking.status)) {
          return NextResponse.json(
            { error: "La richiesta è già stata gestita" },
            { status: 400 },
          );
        }
        update.responded_at = new Date().toISOString();
        if (input.action === "conferma") {
          update.status = "confermata";
          notifyStatus = "confermata";
        } else if (input.action === "rifiuta") {
          update.status = "rifiutata";
          update.supplier_response = REASON_LABELS[input.reason ?? "altro"];
          notifyStatus = "rifiutata";
        } else {
          if (!input.alternativeDate) {
            return NextResponse.json(
              { error: "Indica la data alternativa proposta" },
              { status: 400 },
            );
          }
          update.status = "data_alternativa";
          update.alternative_date = input.alternativeDate;
          notifyStatus = "data_alternativa";
        }
        break;
      }

      case "accetta_alternativa": {
        if (!isClient) {
          return NextResponse.json({ error: "Azione riservata al cliente" }, { status: 403 });
        }
        if (booking.status !== "data_alternativa" || !booking.alternative_date) {
          return NextResponse.json(
            { error: "Nessuna data alternativa da accettare" },
            { status: 400 },
          );
        }
        update.status = "confermata";
        update.requested_date = booking.alternative_date;
        update.alternative_date = null;
        break;
      }

      case "annulla": {
        if (["completata", "annullata", "rifiutata", "no_show"].includes(booking.status)) {
          return NextResponse.json(
            { error: "La prenotazione non è annullabile" },
            { status: 400 },
          );
        }
        // Regola disdetta: oltre la conferma/pagamento serve preavviso di 48h.
        if (["confermata", "pagata"].includes(booking.status)) {
          const start = new Date(booking.requested_date).getTime();
          const hoursToStart = (start - Date.now()) / (1000 * 60 * 60);
          if (hoursToStart < CANCELLATION_HOURS) {
            return NextResponse.json(
              {
                error: `Annullamento non consentito: meno di ${CANCELLATION_HOURS} ore all'esperienza.`,
              },
              { status: 400 },
            );
          }
        }
        update.status = "annullata";
        break;
      }
    }

    const { data: updated, error: uErr } = await supabase
      .from("bookings")
      .update(update)
      .eq("id", params.id)
      .select()
      .single();
    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 400 });

    // Notifica al cliente i cambi di stato decisi dal fornitore
    if (notifyStatus) {
      await notifyClientBookingUpdate(
        {
          email: (booking as any).client?.email,
          whatsapp: (booking as any).client?.phone,
        },
        {
          bookingCode: booking.booking_code,
          experienceTitle: (booking as any).experience?.title ?? "Esperienza",
          status: notifyStatus,
          date: (update.alternative_date as string) ?? booking.requested_date,
        },
      );
    }

    return NextResponse.json({ booking: updated });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
