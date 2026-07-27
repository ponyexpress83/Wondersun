"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

/**
 * Configurazione delle policy di cancellazione e rimborso
 * (Allegato A § 4.3). Salva su platform_settings via /api/admin/settings.
 */
export default function PolicySettingsForm({
  initialHours,
  initialRefundPolicy,
}: {
  initialHours: number;
  initialRefundPolicy: string;
}) {
  const router = useRouter();
  const [hours, setHours] = useState(String(initialHours));
  const [policy, setPolicy] = useState(initialRefundPolicy);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const h = Number(hours);
    if (!Number.isFinite(h) || h < 0 || h > 720) {
      toast.error("Indica un valore tra 0 e 720 ore");
      return;
    }
    setSaving(true);
    try {
      for (const [key, value] of [
        ["default_cancellation_hours", String(h)],
        ["refund_policy_note", policy],
      ] as const) {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Salvataggio non riuscito");
      }
      toast.success("Policy aggiornate");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 max-w-2xl">
      <h2 className="font-display text-xl font-bold text-ws-dark mb-1">
        Policy di cancellazione e rimborso
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Valori predefiniti della piattaforma. Ogni esperienza può avere un preavviso
        specifico che ha la precedenza su questo.
      </p>

      <label htmlFor="hours" className="ws-label">
        Preavviso minimo per l&apos;annullamento gratuito (ore)
      </label>
      <input
        id="hours"
        type="number"
        min={0}
        max={720}
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="ws-input max-w-[180px]"
      />
      <p className="text-xs text-gray-600 mt-1 mb-5">
        Esempio: 48 = il cliente può annullare gratuitamente fino a 48 ore prima.
      </p>

      <label htmlFor="policy" className="ws-label">
        Testo della politica di rimborso (mostrato al cliente)
      </label>
      <textarea
        id="policy"
        rows={5}
        value={policy}
        onChange={(e) => setPolicy(e.target.value)}
        className="ws-input resize-y"
      />

      <button onClick={save} disabled={saving} className="ws-btn-blue mt-5">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? "Salvataggio…" : "Salva policy"}
      </button>
    </div>
  );
}
