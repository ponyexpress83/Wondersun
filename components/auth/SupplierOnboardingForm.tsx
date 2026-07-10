"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, AlertCircle } from "lucide-react";

interface Props {
  profileId: string;
}

export default function SupplierOnboardingForm({ profileId }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: profileId,
          business_name: fd.get("business_name"),
          vat_number: fd.get("vat_number"),
          city: fd.get("city"),
          province: fd.get("province"),
          description: fd.get("description"),
          contact_email: fd.get("contact_email"),
          contact_phone: fd.get("contact_phone"),
          website: fd.get("website"),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Errore durante l'invio");
      }
      toast.success("Candidatura inviata! Ti contatteremo entro 48 ore.");
      router.push("/fornitore/dashboard");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore imprevisto";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-ws-red">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="business_name" className="ws-label">
          Ragione sociale / nome attività *
        </label>
        <input id="business_name" name="business_name" type="text" required className="ws-input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="vat_number" className="ws-label">
            P. IVA
          </label>
          <input id="vat_number" name="vat_number" type="text" className="ws-input" />
        </div>
        <div>
          <label htmlFor="province" className="ws-label">
            Provincia
          </label>
          <input
            id="province"
            name="province"
            type="text"
            maxLength={2}
            placeholder="GR"
            className="ws-input uppercase"
          />
        </div>
      </div>

      <div>
        <label htmlFor="city" className="ws-label">
          Città *
        </label>
        <input id="city" name="city" type="text" required className="ws-input" />
      </div>

      <div>
        <label htmlFor="description" className="ws-label">
          Descrivi la tua attività *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="ws-input resize-y"
          placeholder="Es. Operatore turistico specializzato in tour in barca lungo la costa dell'Argentario. Attivi dal 2015 con licenza ENAC e copertura assicurativa professionale."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_email" className="ws-label">
            Email contatto *
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            required
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="contact_phone" className="ws-label">
            Telefono
          </label>
          <input id="contact_phone" name="contact_phone" type="tel" className="ws-input" />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="ws-label">
          Sito web (opzionale)
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://"
          className="ws-input"
        />
      </div>

      <div className="bg-ws-blue-pale border border-ws-blue/15 rounded-lg p-3 text-xs text-ws-blue-dark">
        Inviando la candidatura prendi atto che: il primo abbonamento parte dopo 3 mesi di prova
        (€29/mese); non sono previste commissioni sui tuoi incassi — il cliente paga te
        direttamente l&apos;esperienza.
      </div>

      <button type="submit" disabled={submitting} className="ws-btn-primary w-full">
        <Store size={15} />
        {submitting ? "Invio…" : "Invia candidatura"}
      </button>
    </form>
  );
}
