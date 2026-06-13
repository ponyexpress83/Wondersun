"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store } from "lucide-react";

export default function SupplierCreateForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"prenotabile" | "vetrina">("prenotabile");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          business_name: fd.get("business_name"),
          login_email: fd.get("login_email"),
          vat_number: fd.get("vat_number") || null,
          city: fd.get("city") || null,
          province: fd.get("province") || null,
          description: fd.get("description") || null,
          contact_email: fd.get("contact_email") || null,
          contact_phone: fd.get("contact_phone") || null,
          website: fd.get("website") || null,
          mode,
          is_founding_partner: fd.get("is_founding_partner") === "on",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success("Fornitore creato e approvato!");
      router.push(`/admin/fornitori/${data.supplierId}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 space-y-5">
      <div>
        <label className="ws-label">Nome attività / ragione sociale *</label>
        <input name="business_name" required className="ws-input" placeholder="Es. Tenuta Montauto" />
      </div>

      <fieldset className="space-y-2">
        <legend className="ws-label">Modalità *</legend>
        <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer has-[:checked]:border-ws-blue has-[:checked]:bg-ws-blue-pale/40">
          <input
            type="radio"
            name="mode_radio"
            checked={mode === "prenotabile"}
            onChange={() => setMode("prenotabile")}
            className="mt-1"
          />
          <span className="text-sm">
            <span className="font-bold text-ws-dark block">Con prenotazione diretta</span>
            <span className="text-ws-text-light">Esperienze prenotabili in piattaforma con conferma e pagamento quota.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer has-[:checked]:border-ws-blue has-[:checked]:bg-ws-blue-pale/40">
          <input
            type="radio"
            name="mode_radio"
            checked={mode === "vetrina"}
            onChange={() => setMode("vetrina")}
            className="mt-1"
          />
          <span className="text-sm">
            <span className="font-bold text-ws-dark block">Solo vetrina · contatto diretto</span>
            <span className="text-ws-text-light">Scheda di visibilità con recapiti diretti, senza prenotazione in piattaforma.</span>
          </span>
        </label>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="ws-label">Email di accesso del fornitore *</label>
          <input name="login_email" type="email" required className="ws-input" placeholder="info@fornitore.it" />
          <p className="text-xs text-ws-text-light mt-1">Con questa email il fornitore potrà accedere alla sua dashboard.</p>
        </div>
        <div>
          <label className="ws-label">P. IVA</label>
          <input name="vat_number" className="ws-input" />
        </div>
        <div>
          <label className="ws-label">Città</label>
          <input name="city" className="ws-input" placeholder="Manciano" />
        </div>
        <div>
          <label className="ws-label">Provincia</label>
          <input name="province" maxLength={2} className="ws-input uppercase" placeholder="GR" />
        </div>
        <div>
          <label className="ws-label">Email pubblica di contatto</label>
          <input name="contact_email" type="email" className="ws-input" />
        </div>
        <div>
          <label className="ws-label">Telefono / WhatsApp</label>
          <input name="contact_phone" className="ws-input" placeholder="+39 ..." />
        </div>
        <div className="sm:col-span-2">
          <label className="ws-label">Sito web</label>
          <input name="website" type="url" className="ws-input" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="ws-label">Descrizione</label>
        <textarea name="description" rows={4} className="ws-input resize-y" placeholder="Racconta l'attività del fornitore…" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="is_founding_partner" defaultChecked className="h-4 w-4 accent-ws-blue" />
        <span className="text-sm text-ws-text">
          Partner fondatore (periodo promozionale dalla data di lancio)
        </span>
      </label>

      <input type="hidden" name="mode" value={mode} />

      <div className="flex justify-end">
        <button type="submit" disabled={busy} className="ws-btn-blue">
          <Store size={15} />
          {busy ? "Creazione…" : "Crea fornitore"}
        </button>
      </div>
    </form>
  );
}
