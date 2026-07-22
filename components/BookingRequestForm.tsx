"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { formatEur, computeCommission } from "@/lib/types";

interface Slot {
  id: string;
  starts_at: string;
  capacity: number;
  booked_count: number;
}

interface Props {
  experienceId: string;
  experienceSlug: string;
  pricePerUnit: number;
  minParticipants: number;
  maxParticipants: number;
  isAuthenticated: boolean;
  requiresRequest: boolean;
}

export default function BookingRequestForm({
  experienceId,
  experienceSlug,
  pricePerUnit,
  minParticipants,
  maxParticipants,
  isAuthenticated,
  requiresRequest,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(minParticipants);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);

  // Calendario disponibilità: se il fornitore ha caricato date a slot, il
  // cliente sceglie tra quelle; altrimenti la data resta libera (call 23/05).
  useEffect(() => {
    fetch(`/api/experiences/${experienceId}/slots`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]));
  }, [experienceId]);

  const total = pricePerUnit * participants;
  const breakdown = computeCommission(total);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/esperienze/${experienceSlug}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          requestedDate: date,
          participants,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Errore durante l'invio della richiesta");
      }
      toast.success(
        requiresRequest
          ? "Richiesta inviata! Il fornitore conferma o propone una data entro 48 ore."
          : "Prenotazione registrata! Completa il pagamento della quota dalla tua area.",
      );
      router.push("/dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="ws-label" htmlFor="date">
          {slots.length > 0 ? "Scegli una data disponibile" : "Data preferita"}
        </label>
        {slots.length > 0 ? (
          <select
            id="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ws-input"
          >
            <option value="">— Seleziona —</option>
            {slots.map((s) => (
              <option key={s.id} value={s.starts_at}>
                {new Date(s.starts_at).toLocaleDateString("it-IT", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                })}{" "}
                ·{" "}
                {new Date(s.starts_at).toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({s.capacity - s.booked_count} posti)
              </option>
            ))}
          </select>
        ) : (
          <input
            id="date"
            type="date"
            required
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="ws-input"
          />
        )}
      </div>

      <div>
        <label className="ws-label" htmlFor="participants">
          Partecipanti
        </label>
        <input
          id="participants"
          type="number"
          required
          min={minParticipants}
          max={maxParticipants}
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className="ws-input"
        />
        <p className="text-xs text-ws-text-light mt-1">
          Da {minParticipants} a {maxParticipants} persone
        </p>
      </div>

      <div>
        <label className="ws-label" htmlFor="notes">
          Note (opzionali)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Eventuali richieste speciali, intolleranze alimentari, esigenze particolari…"
          className="ws-input resize-y"
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ws-text-light">
            {participants} × {formatEur(pricePerUnit)}
          </span>
          <span className="font-display text-xl font-bold text-ws-blue">{formatEur(total)}</span>
        </div>

        <div className="bg-ws-ivory rounded-xl p-3 space-y-2 mt-2">
          <div className="flex justify-between items-start gap-3 text-sm">
            <span className="text-ws-text">
              Prezzo esperienza
              <span className="block text-[0.7rem] text-ws-text-light">
                Pagato direttamente al fornitore
              </span>
            </span>
            <span className="font-bold text-ws-text whitespace-nowrap">
              {formatEur(breakdown.pay_onsite_cents)}
            </span>
          </div>
          <div className="flex justify-between items-start gap-3 text-sm border-t border-gray-100 pt-2">
            <span className="text-ws-text">
              Quota digitale Wondersun ({breakdown.commission_pct}%)
              <span className="block text-[0.7rem] text-ws-text-light">
                La versi online — concierge digitale
              </span>
            </span>
            <span className="font-bold text-ws-text whitespace-nowrap">
              {formatEur(breakdown.pay_now_cents)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-3 text-sm border-t border-gray-200 pt-2">
            <span className="font-semibold text-ws-text">Totale a carico tuo</span>
            <span className="font-display text-lg font-bold text-ws-blue whitespace-nowrap">
              {formatEur(total + breakdown.pay_now_cents)}
            </span>
          </div>
        </div>
        <p className="text-[0.7rem] text-ws-text-light mt-2 text-center">
          Online versi solo la quota digitale Wondersun; il prezzo dell&apos;esperienza lo paghi
          direttamente al fornitore.
        </p>
      </div>

      {isAuthenticated ? (
        <button type="submit" disabled={submitting} className="ws-btn-primary w-full">
          <Send size={15} />
          {submitting
            ? "Invio…"
            : requiresRequest
              ? "Invia richiesta"
              : "Prenota ora"}
        </button>
      ) : (
        <Link href={`/login?redirect=/esperienze/${experienceSlug}`} className="ws-btn-primary w-full">
          Accedi per prenotare
        </Link>
      )}

      <p className="text-[0.7rem] text-ws-text-light text-center leading-relaxed">
        Inviando la richiesta accetti i nostri{" "}
        <Link href="/termini" className="underline">
          Termini di Servizio
        </Link>{" "}
        e la{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
