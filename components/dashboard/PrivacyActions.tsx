"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";

/**
 * Pannello diritti GDPR per l'utente loggato (Art. 17 + 20).
 * Allegato A § 5.3 del contratto.
 */
export default function PrivacyActions() {
  const router = useRouter();
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);

  const onExport = async () => {
    setBusy("export");
    try {
      const res = await fetch("/api/me/export");
      if (!res.ok) throw new Error("Errore durante l'esportazione");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wondersun-dati-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Dati scaricati");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Eliminare definitivamente l'account?\n\nQuesta operazione è irreversibile e cancellerà profilo, prenotazioni, preferiti e pacchetti. Eventuali prenotazioni storiche come fornitore potrebbero impedire la cancellazione automatica: in tal caso contatta il supporto.",
    );
    if (!confirmed) return;
    setBusy("delete");
    try {
      const res = await fetch("/api/me/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore durante la cancellazione");
      toast.success("Account eliminato");
      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card mt-8">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-display text-2xl font-bold text-ws-dark">Privacy e dati</h2>
        <p className="text-sm text-ws-text-light mt-1">
          Esercita i tuoi diritti GDPR di portabilità e cancellazione.
        </p>
      </div>
      <div className="p-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onExport}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-ws-text hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={15} />
          {busy === "export" ? "Esportazione…" : "Scarica i miei dati (JSON)"}
        </button>
        <button
          onClick={onDelete}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-sm font-semibold text-ws-red hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={15} />
          {busy === "delete" ? "Cancellazione…" : "Elimina il mio account"}
        </button>
      </div>
    </section>
  );
}
