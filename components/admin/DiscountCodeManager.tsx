"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Ticket } from "lucide-react";
import { formatEur } from "@/lib/types";

interface Code {
  id: string;
  code: string;
  description: string | null;
  kind: "percent" | "fixed_cents";
  value: number;
  valid_until: string | null;
  usage_limit: number | null;
  used_count: number;
  active: boolean;
}

export default function DiscountCodeManager({ initialCodes }: { initialCodes: Code[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "fixed_cents">("percent");
  const [value, setValue] = useState(10);
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!code.trim()) {
      toast.error("Inserisci il codice");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/discount-codes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          description: description || null,
          kind,
          value: kind === "fixed_cents" ? Math.round(value * 100) : value,
          validUntil: validUntil || null,
          usageLimit: usageLimit === "" ? null : Number(usageLimit),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success("Codice creato");
      setAdding(false);
      setCode("");
      setDescription("");
      setUsageLimit("");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare il codice?")) return;
    try {
      await fetch(`/api/discount-codes?id=${id}`, { method: "DELETE" });
      toast.success("Codice eliminato");
      router.refresh();
    } catch {
      toast.error("Errore");
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ws-dark">Codici attivi</h2>
          <p className="text-xs text-ws-text-light mt-1">
            Lo sconto si applica esclusivamente alla quota Wondersun mostrata in checkout.
          </p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="ws-btn-blue">
          <Plus size={15} /> Nuovo codice
        </button>
      </div>

      {adding && (
        <div className="p-6 bg-ws-ivory/40 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="ws-label">Codice</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="ws-input"
              placeholder="ESTATE2026"
            />
          </div>
          <div>
            <label className="ws-label">Tipo</label>
            <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="ws-input">
              <option value="percent">% sulla quota Wondersun</option>
              <option value="fixed_cents">€ fissi</option>
            </select>
          </div>
          <div>
            <label className="ws-label">Valore {kind === "percent" ? "(%)" : "(€)"}</label>
            <input
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="ws-input"
            />
          </div>
          <div>
            <label className="ws-label">Limite utilizzi (vuoto = illimitato)</label>
            <input
              type="number"
              min={1}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
              className="ws-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="ws-label">Valido fino al</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="ws-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="ws-label">Descrizione (opzionale)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ws-input"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm font-semibold text-ws-text-light">
              Annulla
            </button>
            <button onClick={create} disabled={busy} className="ws-btn-blue">
              Crea codice
            </button>
          </div>
        </div>
      )}

      {initialCodes.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Ticket size={40} className="text-ws-text-light mx-auto mb-3" />
          <p className="text-ws-text-light">Nessun codice sconto attivo.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-ws-text-light bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Codice</th>
              <th className="px-6 py-3 text-left">Sconto</th>
              <th className="px-6 py-3 text-left">Utilizzi</th>
              <th className="px-6 py-3 text-left">Scadenza</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialCodes.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-3 font-mono font-bold text-ws-blue">{c.code}</td>
                <td className="px-6 py-3">
                  {c.kind === "percent" ? `${c.value}%` : formatEur(c.value)}
                </td>
                <td className="px-6 py-3 text-ws-text-light">
                  {c.used_count} {c.usage_limit ? `/ ${c.usage_limit}` : ""}
                </td>
                <td className="px-6 py-3 text-ws-text-light">
                  {c.valid_until ? new Date(c.valid_until).toLocaleDateString("it-IT") : "—"}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => remove(c.id)}
                    className="text-ws-red hover:bg-red-50 p-1.5 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
