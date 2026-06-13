"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function SeedMontautoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/seed-montauto", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success("Tenuta Montauto caricata con le sue degustazioni!");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={run} disabled={busy} className="ws-btn-ghost text-sm">
      <Sparkles size={15} />
      {busy ? "Carico…" : "Carica esempio Tenuta Montauto"}
    </button>
  );
}
