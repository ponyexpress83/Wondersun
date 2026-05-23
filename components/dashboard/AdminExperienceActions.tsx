"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, RotateCcw } from "lucide-react";

interface Props {
  experienceId: string;
  status: string;
}

export default function AdminExperienceActions({ experienceId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const setStatus = async (next: string, okMsg: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/experiences/${experienceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
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

  if (status === "pubblicata") {
    return (
      <button
        disabled={busy}
        onClick={() => setStatus("sospesa", "Esperienza sospesa")}
        className="inline-flex items-center gap-1 border border-gray-200 text-ws-red rounded-md text-xs font-bold py-1.5 px-2.5 uppercase tracking-wide hover:bg-red-50 disabled:opacity-50"
      >
        <Ban size={12} /> Sospendi
      </button>
    );
  }
  if (status === "sospesa") {
    return (
      <button
        disabled={busy}
        onClick={() => setStatus("pubblicata", "Esperienza ripristinata")}
        className="inline-flex items-center gap-1 ws-btn-blue text-xs py-1.5 px-2.5 disabled:opacity-50"
      >
        <RotateCcw size={12} /> Ripristina
      </button>
    );
  }
  return <span className="text-xs text-ws-text-light">—</span>;
}
