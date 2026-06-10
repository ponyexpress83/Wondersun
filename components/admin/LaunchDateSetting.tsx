"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Rocket } from "lucide-react";

interface Props {
  currentValue: string | null;
}

/**
 * Data di lancio della piattaforma: da questa data partono i periodi
 * promozionali dei partner fondatori (3 mesi prenotabili · 1 mese vetrine).
 */
export default function LaunchDateSetting({ currentValue }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(currentValue ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: "launch_date", value: value || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success(value ? "Data di lancio impostata" : "Data di lancio rimossa");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 mt-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-ws-blue-pale flex items-center justify-center flex-shrink-0">
          <Rocket size={18} className="text-ws-blue" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ws-dark">Data di lancio</h2>
          <p className="text-xs text-ws-text-light mt-0.5">
            Da questa data partono le promo fondatori: 3 mesi gratis per i prenotabili, 1 mese per
            le vetrine. Finché non è impostata, i fondatori restano in attesa senza scadenze.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="ws-input max-w-[200px]"
        />
        <button onClick={save} disabled={busy} className="ws-btn-blue">
          {busy ? "Salvataggio…" : "Salva"}
        </button>
      </div>
    </section>
  );
}
