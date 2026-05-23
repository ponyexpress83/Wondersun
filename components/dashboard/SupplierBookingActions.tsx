"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, CalendarClock } from "lucide-react";

interface Props {
  bookingId: string;
  status: string;
}

type Mode = "idle" | "alternativa" | "rifiuta";

const REASONS = [
  { value: "non_disponibile", label: "Data non disponibile" },
  { value: "meteo", label: "Condizioni meteo" },
  { value: "capienza", label: "Capienza esaurita" },
  { value: "altro", label: "Altro" },
] as const;

export default function SupplierBookingActions({ bookingId, status }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [altDate, setAltDate] = useState("");
  const [reason, setReason] = useState<string>("non_disponibile");
  const [busy, setBusy] = useState(false);

  const actionable = status === "richiesta" || status === "data_alternativa";
  if (!actionable) {
    return <span className="text-xs text-ws-text-light">—</span>;
  }

  const submit = async (body: Record<string, unknown>, okMsg: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Errore");
      }
      toast.success(okMsg);
      setMode("idle");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (mode === "alternativa") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          min={today}
          value={altDate}
          onChange={(e) => setAltDate(e.target.value)}
          className="ws-input py-1.5 text-xs w-36"
        />
        <button
          disabled={busy || !altDate}
          onClick={() =>
            submit(
              { action: "proponi_alternativa", alternativeDate: altDate },
              "Data alternativa proposta al cliente",
            )
          }
          className="ws-btn-blue text-[0.65rem] py-1.5 px-2.5"
        >
          Invia
        </button>
        <button
          onClick={() => setMode("idle")}
          className="text-xs text-ws-text-light hover:text-ws-text"
        >
          Annulla
        </button>
      </div>
    );
  }

  if (mode === "rifiuta") {
    return (
      <div className="flex items-center gap-2">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="ws-input py-1.5 text-xs w-40"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          onClick={() => submit({ action: "rifiuta", reason }, "Richiesta rifiutata")}
          className="bg-ws-red text-white rounded-md text-[0.65rem] font-bold py-1.5 px-2.5 uppercase tracking-wide hover:bg-ws-red-dark"
        >
          Conferma rifiuto
        </button>
        <button
          onClick={() => setMode("idle")}
          className="text-xs text-ws-text-light hover:text-ws-text"
        >
          Annulla
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={busy}
        onClick={() => submit({ action: "conferma" }, "Prenotazione confermata")}
        className="inline-flex items-center gap-1 bg-green-600 text-white rounded-md text-[0.65rem] font-bold py-1.5 px-2.5 uppercase tracking-wide hover:bg-green-700"
      >
        <Check size={12} /> Conferma
      </button>
      <button
        disabled={busy}
        onClick={() => setMode("alternativa")}
        className="inline-flex items-center gap-1 ws-btn-blue text-[0.65rem] py-1.5 px-2.5"
      >
        <CalendarClock size={12} /> Altra data
      </button>
      <button
        disabled={busy}
        onClick={() => setMode("rifiuta")}
        className="inline-flex items-center gap-1 border border-gray-200 text-ws-red rounded-md text-[0.65rem] font-bold py-1.5 px-2.5 uppercase tracking-wide hover:bg-red-50"
      >
        <X size={12} /> Rifiuta
      </button>
    </div>
  );
}
