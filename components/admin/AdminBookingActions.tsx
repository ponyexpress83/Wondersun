"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Ban, UserX, Loader2 } from "lucide-react";

/**
 * Azioni amministrative su una prenotazione (Allegato A § 4.1 — "gestione
 * prenotazioni globale: visualizzazione e modifica di qualsiasi prenotazione").
 * L'admin può intervenire anche al posto del fornitore per gestire i casi
 * eccezionali (es. fornitore irreperibile) e annullare oltre i termini.
 */
export default function AdminBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (action: string, okMsg: string, confirmMsg?: string) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "rifiuta" ? { action, reason: "altro" } : { action },
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Operazione non riuscita");
      toast.success(okMsg);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  const pending = ["richiesta", "data_alternativa"].includes(status);
  const active = ["confermata", "pagata"].includes(status);
  const closed = ["completata", "annullata", "rifiutata", "no_show"].includes(status);

  if (closed) return <span className="text-xs text-gray-500">—</span>;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {busy && <Loader2 size={13} className="animate-spin text-ws-blue" />}
      {pending && (
        <>
          <button
            disabled={busy}
            onClick={() => run("conferma", "Prenotazione confermata")}
            className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-green-100 disabled:opacity-50"
          >
            <CheckCircle2 size={12} /> Conferma
          </button>
          <button
            disabled={busy}
            onClick={() =>
              run("rifiuta", "Prenotazione rifiutata", "Rifiutare questa richiesta?")
            }
            className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle size={12} /> Rifiuta
          </button>
        </>
      )}
      {active && (
        <>
          <button
            disabled={busy}
            onClick={() => run("completata", "Segnata come completata")}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-blue-100 disabled:opacity-50"
          >
            <CheckCircle2 size={12} /> Completata
          </button>
          <button
            disabled={busy}
            onClick={() => run("no_show", "Segnato no-show", "Segnare il cliente come no-show?")}
            className="inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-gray-100 disabled:opacity-50"
          >
            <UserX size={12} /> No-show
          </button>
        </>
      )}
      <button
        disabled={busy}
        onClick={() =>
          run("annulla", "Prenotazione annullata", "Annullare questa prenotazione?")
        }
        className="inline-flex items-center gap-1 rounded-full bg-white text-ws-red border border-red-200 px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-red-50 disabled:opacity-50"
      >
        <Ban size={12} /> Annulla
      </button>
    </div>
  );
}
