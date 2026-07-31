"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Pencil, X } from "lucide-react";

interface Supplier {
  id: string;
  business_name: string;
  vat_number?: string | null;
  registered_office?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  description?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  mode?: string | null;
}

/**
 * Modifica dell'anagrafica del fornitore dal pannello amministrazione
 * (Allegato A § 4.1). I fornitori non modificano la propria scheda: la cura
 * lo staff Wondersun.
 */
export default function SupplierEditForm({ supplier }: { supplier: Supplier }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: supplier.business_name ?? "",
    vat_number: supplier.vat_number ?? "",
    registered_office: supplier.registered_office ?? "",
    city: supplier.city ?? "",
    province: supplier.province ?? "",
    postal_code: supplier.postal_code ?? "",
    description: supplier.description ?? "",
    contact_email: supplier.contact_email ?? "",
    contact_phone: supplier.contact_phone ?? "",
    website: supplier.website ?? "",
    mode: (supplier.mode as "prenotabile" | "vetrina") ?? "prenotabile",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (form.business_name.trim().length < 2) {
      toast.error("Indica il nome dell'attività");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/suppliers/${supplier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Salvataggio non riuscito");
      toast.success("Dati del fornitore aggiornati");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="ws-btn-ghost text-sm">
        <Pencil size={15} /> Modifica dati fornitore
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-ws-dark">Dati del fornitore</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-ws-text-light hover:text-ws-red"
          aria-label="Chiudi"
        >
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="ws-label">Nome dell&apos;attività *</label>
        <input
          className="ws-input"
          value={form.business_name}
          onChange={(e) => set("business_name", e.target.value)}
        />
      </div>

      <div>
        <label className="ws-label">Descrizione</label>
        <textarea
          rows={4}
          className="ws-input resize-y"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="ws-label">Indirizzo / sede</label>
          <input
            className="ws-input"
            value={form.registered_office}
            onChange={(e) => set("registered_office", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Città</label>
          <input
            className="ws-input"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Provincia</label>
          <input
            className="ws-input"
            maxLength={2}
            value={form.province}
            onChange={(e) => set("province", e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label className="ws-label">CAP</label>
          <input
            className="ws-input"
            value={form.postal_code}
            onChange={(e) => set("postal_code", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Partita IVA</label>
          <input
            className="ws-input"
            value={form.vat_number}
            onChange={(e) => set("vat_number", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Telefono</label>
          <input
            className="ws-input"
            value={form.contact_phone}
            onChange={(e) => set("contact_phone", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Email di contatto</label>
          <input
            type="email"
            className="ws-input"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
          />
        </div>
        <div>
          <label className="ws-label">Sito web</label>
          <input
            type="url"
            className="ws-input"
            placeholder="https://…"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="ws-label">Modalità</label>
        <select
          className="ws-input"
          value={form.mode}
          onChange={(e) => set("mode", e.target.value)}
        >
          <option value="prenotabile">Prenotabile · richieste dalla piattaforma</option>
          <option value="vetrina">Solo vetrina · contatto diretto</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={save} disabled={saving} className="ws-btn-blue">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
        <button onClick={() => setOpen(false)} className="ws-btn-ghost">
          Annulla
        </button>
      </div>
    </div>
  );
}
