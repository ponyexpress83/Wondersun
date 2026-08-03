import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CANCELLATION_HOURS } from "@/lib/types";
import { getPlatformPolicy } from "@/lib/settings";
import { computePaymentDeadline } from "@/lib/payment-window";
import { notifyClientBookingUpdate, notifyAdminRefundDue } from "@/lib/notify";
import { logAudit } from "@/lib/audit";

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
    "completata",
    "no_show",
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

/**
 * Motivi di annullamento dopo la conferma (forza maggiore).
 * Per le esperienze in mare l'annullamento è spesso un obbligo di sicurezza.
 */
const REASON_LABELS_SUPPLIER: Record<string, string> = {
  meteo: "Condizioni meteo o mare non idonee: uscita annullata per sicurezza",
  non_disponibile: "Imprevisto dell'operatore: esperienza annullata",
  capienza: "Numero minimo di partecipanti non raggiunto",
  altro: "Esperienza annullata dall'operatore",
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
        "*, experience:experiences(title, cancellation_hours), supplier:suppliers(profile_id), client:profiles!bookings_client_id_fkey(email, phone)",
      )
      .eq("id", params.id)
      .single();
    if (bErr || !booking) {
      return NextResponse.json({ error: "Prenotazione non trovata" }, { status: 404 });
    }

    const isSupplier = (booking as any).supplier?.profile_id === user.id;
    const isClient = booking.client_id === user.id;
    // L'amministratore può intervenire su qualsiasi prenotazione
    // (Allegato A § 4.1 — "gestione prenotazioni globale: visualizzazione e
    // modifica di qualsiasi prenotazione").
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const isAdmin = me?.role === "admin";
    if (!isSupplier && !isClient && !isAdmin) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const update: Record<string, unknown> = {};
    let notifyStatus: string | null = null;

    switch (input.action) {
      case "conferma":
      case "rifiuta":
      case "proponi_alternativa": {
        if (!isSupplier && !isAdmin) {
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
          // La prenotazione resta "in attesa di pagamento": il cliente ha una
          // finestra limitata per versare la quota Wondersun, poi viene
          // annullata automaticamente e la data torna disponibile.
          update.payment_deadline = await computePaymentDeadline();
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
        if (!isClient && !isAdmin) {
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
        // Anche accettando la data alternativa la prenotazione resta "in attesa
        // di pagamento": senza questa scadenza il timer non partiva e la
        // richiesta restava aperta a tempo indeterminato.
        update.payment_deadline = await computePaymentDeadline();
        break;
      }

      case "annulla": {
        if (["completata", "annullata", "rifiutata", "no_show"].includes(booking.status)) {
          return NextResponse.json(
            { error: "La prenotazione non è annullabile" },
            { status: 400 },
          );
        }
        // Policy di cancellazione configurabile per esperienza (Allegato A § 4.3).
        // Default 48h dalla call 23/05; il fornitore può stringere per esperienze
        // food/premium con materie prime preparate (cooking class, ristoranti).
        // L'amministratore può annullare anche oltre i termini (gestione casi
        // eccezionali dal pannello — Allegato A § 4.1).
        // Il FORNITORE può annullare senza limite di preavviso: l'annullamento
        // per causa di forza maggiore (maltempo, mare mosso, guasto) può
        // rendersi necessario anche il giorno stesso — per un diving è un
        // obbligo di sicurezza. Il limite resta per il cliente che disdice.
        if (!isAdmin && !isSupplier && ["confermata", "pagata"].includes(booking.status)) {
          // Precedenza: policy della singola esperienza → default configurato
          // dall'admin (Allegato A § 4.3) → costante di fallback.
          const platform = await getPlatformPolicy();
          const hours =
            (booking as any).experience?.cancellation_hours ??
            platform.cancellationHours ??
            CANCELLATION_HOURS;
          const start = new Date(booking.requested_date).getTime();
          const hoursToStart = (start - Date.now()) / (1000 * 60 * 60);
          if (hoursToStart < hours) {
            return NextResponse.json(
              {
                error: `Annullamento non consentito: meno di ${hours} ore all'esperienza.`,
              },
              { status: 400 },
            );
          }
        }
        update.status = "annullata";
        // Se annulla il fornitore, il cliente deve sapere il perché (maltempo,
        // mare mosso…) e viene avvisato.
        if (isSupplier) {
          update.supplier_response = REASON_LABELS_SUPPLIER[input.reason ?? "altro"];
          update.responded_at = new Date().toISOString();
          notifyStatus = "annullata_dal_fornitore";
        }
        break;
      }

      // Chiusura dell'esperienza dopo la fruizione (Allegato A § 3.3).
      // Il fornitore segna l'esito una volta passata la data.
      case "completata":
      case "no_show": {
        if (!isSupplier && !isAdmin) {
          return NextResponse.json({ error: "Azione riservata al fornitore" }, { status: 403 });
        }
        if (!["confermata", "pagata"].includes(booking.status)) {
          return NextResponse.json(
            { error: "Si può chiudere solo una prenotazione confermata o pagata" },
            { status: 400 },
          );
        }
        update.status = input.action;
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

    // Annullamento dal fornitore su prenotazione GIÀ PAGATA: la quota di
    // servizio va restituita al cliente. Avvisiamo l'amministrazione, che
    // gestisce il rimborso da Stripe (Art. 11 del contratto).
    if (input.action === "annulla" && isSupplier && booking.status === "pagata") {
      await notifyAdminRefundDue({
        bookingCode: booking.booking_code,
        experienceTitle: (booking as any).experience?.title ?? "Esperienza",
        amountCents: booking.commission_cents ?? 0,
        reason: (update.supplier_response as string) ?? "Annullata dall'operatore",
        clientEmail: (booking as any).client?.email ?? null,
      });
    }

    await logAudit({
      actorId: user.id,
      action: `booking.${input.action}`,
      entityType: "booking",
      entityId: params.id,
      metadata: { previous_status: booking.status, new_status: update.status },
    });

    return NextResponse.json({ booking: updated });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Validazione" }, { status: 400 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Errore" }, { status: 500 });
  }
}
