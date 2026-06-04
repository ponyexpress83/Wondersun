"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Ban, RotateCcw } from "lucide-react";

interface Props {
  supplierId: string;
  status: string;
}

type Pending = "rifiuta" | "sospendi" | null;

export default function AdminSupplierActions({ supplierId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending>(null);
  const [reason, setReason] = useState("");

  const submit = async (action: string, okMsg: string, reasonText?: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: reasonText }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Errore");
      }
      toast.success(okMsg);
      setPending(null);
      setReason("");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  if (pending) {
    const isReject = pending === "rifiuta";
    return (
      <div className="flex flex-col gap-2 w-full">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder={
            isReject
              ? "Motivo del rifiuto (visibile al fornitore)…"
              : "Motivo della sospensione (visibile al fornitore)…"
          }
          className="ws-input resize-y text-sm"
        />
        <div className="flex items-center gap-2">
          <button
            disabled={busy || !reason.trim()}
            onClick={() =>
              submit(pending, isReject ? "Candidatura rifiutata" : "Fornitore sospeso", reason)
            }
            className="bg-ws-red text-white rounded-md text-xs font-bold py-2 px-3 uppercase tracking-wide hover:bg-ws-red-dark disabled:opacity-50"
          >
            Conferma {isReject ? "rifiuto" : "sospensione"}
          </button>
          <button
            onClick={() => {
              setPending(null);
              setReason("");
            }}
            className="text-xs text-ws-text-light hover:text-ws-text"
          >
            Annulla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(status === "in_attesa" || status === "rifiutato") && (
        <button
          disabled={busy}
          onClick={() => submit("approva", "Fornitore approvato")}
          className="inline-flex items-center gap-1 bg-green-600 text-white rounded-md text-xs font-bold py-2 px-3 uppercase tracking-wide hover:bg-green-700"
        >
          <Check size={13} /> Approva
        </button>
      )}
      {status === "in_attesa" && (
        <button
          disabled={busy}
          onClick={() => setPending("rifiuta")}
          className="inline-flex items-center gap-1 border border-gray-200 text-ws-red rounded-md text-xs font-bold py-2 px-3 uppercase tracking-wide hover:bg-red-50"
        >
          <X size={13} /> Rifiuta
        </button>
      )}
      {status === "approvato" && (
        <button
          disabled={busy}
          onClick={() => setPending("sospendi")}
          className="inline-flex items-center gap-1 border border-gray-200 text-ws-red rounded-md text-xs font-bold py-2 px-3 uppercase tracking-wide hover:bg-red-50"
        >
          <Ban size={13} /> Sospendi
        </button>
      )}
      {status === "sospeso" && (
        <button
          disabled={busy}
          onClick={() => submit("riattiva", "Fornitore riattivato")}
          className="inline-flex items-center gap-1 ws-btn-blue text-xs py-2 px-3"
        >
          <RotateCcw size={13} /> Riattiva
        </button>
      )}
    </div>
  );
}
