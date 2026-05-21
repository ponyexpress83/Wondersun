"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { formatEur, computeCommission } from "@/lib/types";

interface Props {
  experienceId: string;
  experienceSlug: string;
  pricePerUnit: number;
  minParticipants: number;
  maxParticipants: number;
  isAuthenticated: boolean;
}

export default function BookingRequestForm({
  experienceId,
  experienceSlug,
  pricePerUnit,
  minParticipants,
  maxParticipants,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(minParticipants);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      toast.success("Richiesta inviata! Il fornitore ti risponderà entro 48 ore.");
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
          Data preferita
        </label>
        <input
          id="date"
          type="date"
          required
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="ws-input"
        />
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
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ws-text-light">
            {participants} × {formatEur(pricePerUnit)}
          </span>
          <span className="font-semibold text-ws-text">{formatEur(total)}</span>
        </div>
        {breakdown.high_value_fee_cents > 0 && (
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ws-text-light">Fee premium</span>
            <span className="font-semibold text-ws-text">
              {formatEur(breakdown.high_value_fee_cents)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-base mt-2 pt-2 border-t border-gray-50">
          <span className="font-display font-bold text-ws-dark">Totale</span>
          <span className="font-display text-xl font-bold text-ws-blue">
            {formatEur(total + breakdown.high_value_fee_cents)}
          </span>
        </div>
      </div>

      {isAuthenticated ? (
        <button type="submit" disabled={submitting} className="ws-btn-primary w-full">
          <Send size={15} />
          {submitting ? "Invio…" : "Invia richiesta"}
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
