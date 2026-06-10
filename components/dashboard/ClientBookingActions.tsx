"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, CreditCard, ShieldCheck } from "lucide-react";
import { formatEur } from "@/lib/types";

interface Props {
  bookingId: string;
  status: string;
  alternativeDate?: string | null;
  payNowCents: number;
}

export default function ClientBookingActions({
  bookingId,
  status,
  alternativeDate,
  payNowCents,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showInformativa, setShowInformativa] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const patch = async (body: Record<string, unknown>, okMsg: string) => {
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
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ informativaAccepted: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        toast.success("Pagamento avviato");
        router.refresh();
      } else if (data.pending) {
        toast.info(data.error ?? "Pagamenti in attivazione");
      } else {
        throw new Error(data.error ?? "Errore");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  if (status === "data_alternativa") {
    return (
      <div className="flex flex-col items-end gap-1.5 mt-2">
        <button
          disabled={busy}
          onClick={() =>
            patch({ action: "accetta_alternativa" }, "Data alternativa accettata")
          }
          className="inline-flex items-center gap-1 bg-green-600 text-white rounded-md text-[0.65rem] font-bold py-1.5 px-2.5 uppercase tracking-wide hover:bg-green-700"
        >
          <Check size={12} />
          Accetta {alternativeDate ? new Date(alternativeDate).toLocaleDateString("it-IT") : ""}
        </button>
        <button
          disabled={busy}
          onClick={() => patch({ action: "annulla" }, "Prenotazione annullata")}
          className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-ws-red hover:underline"
        >
          <X size={12} /> Rifiuta e annulla
        </button>
      </div>
    );
  }

  if (status === "confermata") {
    return (
      <div className="flex flex-col items-end gap-1.5 mt-2">
        <button
          disabled={busy}
          onClick={() => {
            setAccepted(false);
            setShowInformativa(true);
          }}
          className="inline-flex items-center gap-1 ws-btn-primary text-[0.65rem] py-1.5 px-3"
        >
          <CreditCard size={12} /> Paga quota {formatEur(payNowCents)}
        </button>
        <button
          disabled={busy}
          onClick={() => patch({ action: "annulla" }, "Prenotazione annullata")}
          className="text-[0.65rem] font-semibold text-ws-text-light hover:text-ws-red"
        >
          Annulla
        </button>

        {showInformativa && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Cosa stai pagando"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left">
              <div className="flex items-start gap-3 mb-4">
                <ShieldCheck size={22} className="text-ws-blue flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-xl font-bold text-ws-dark">
                    Cosa stai pagando
                  </h3>
                  <p className="text-xs text-ws-text-light">
                    Informativa richiesta prima del pagamento
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-ws-text mb-5">
                <p>
                  Stai pagando <strong>{formatEur(payNowCents)}</strong> a Wondersun come{" "}
                  <strong>servizio di prenotazione digitale personalizzata</strong> (il concierge
                  digitale che ha gestito la tua richiesta).
                </p>
                <p>
                  Il pagamento del <strong>servizio turistico</strong> (l&apos;esperienza vera e
                  propria) <strong>NON</strong> avviene su questa piattaforma: lo verserai
                  direttamente al fornitore al momento della fruizione, secondo le modalità da lui
                  indicate.
                </p>
                <p className="text-xs text-ws-text-light">
                  Si applicano i Termini e Condizioni della piattaforma. Annullamento gratuito
                  fino a 48 ore prima dell&apos;esperienza (salvo policy specifica indicata sulla
                  scheda).
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-5">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-ws-blue focus:ring-ws-blue"
                />
                <span className="text-sm text-ws-text">
                  Ho letto e compreso che cosa sto pagando online e che il servizio turistico si
                  paga direttamente al fornitore.
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowInformativa(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-ws-text hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  disabled={!accepted || busy}
                  onClick={() => {
                    setShowInformativa(false);
                    pay();
                  }}
                  className="flex-1 ws-btn-primary text-sm disabled:opacity-50"
                >
                  Procedi al pagamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === "richiesta") {
    return (
      <button
        disabled={busy}
        onClick={() => patch({ action: "annulla" }, "Richiesta annullata")}
        className="mt-2 text-[0.65rem] font-semibold text-ws-text-light hover:text-ws-red"
      >
        Annulla richiesta
      </button>
    );
  }

  return null;
}
