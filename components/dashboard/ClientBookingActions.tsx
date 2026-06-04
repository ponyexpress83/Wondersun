"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, CreditCard } from "lucide-react";
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
      const res = await fetch(`/api/bookings/${bookingId}/pay`, { method: "POST" });
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
          onClick={pay}
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
