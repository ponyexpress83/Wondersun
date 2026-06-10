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
          mode: fd.get("mode") ?? "prenotabile",
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

      <fieldset className="space-y-2">
        <legend className="ws-label">Come vuoi essere presente su Wondersun? *</legend>
        <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-ws-blue/40 has-[:checked]:border-ws-blue has-[:checked]:bg-ws-blue-pale/40">
          <input
            type="radio"
            name="mode"
            value="prenotabile"
            defaultChecked
            className="mt-1 h-4 w-4 text-ws-blue focus:ring-ws-blue"
          />
          <span className="text-sm">
            <span className="font-bold text-ws-dark block">Con prenotazione diretta</span>
            <span className="text-ws-text-light">
              Le tue esperienze sono prenotabili in piattaforma: ricevi le richieste, confermi e
              incassi il saldo dal cliente al momento dell&apos;esperienza.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-ws-blue/40 has-[:checked]:border-ws-blue has-[:checked]:bg-ws-blue-pale/40">
          <input
            type="radio"
            name="mode"
            value="vetrina"
            className="mt-1 h-4 w-4 text-ws-blue focus:ring-ws-blue"
          />
          <span className="text-sm">
            <span className="font-bold text-ws-dark block">Solo vetrina · contatto diretto</span>
            <span className="text-ws-text-light">
              Per strutture ricettive (hotel, camping, B&amp;B) e operatori che preferiscono
              ricevere i clienti su telefono, WhatsApp, email o sito: scheda di visibilità senza
              prenotazione in piattaforma.
            </span>
          </span>
        </label>
      </fieldset>

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
        (€29/mese); su ogni prenotazione confermata viene trattenuta la commissione del 25%.
      </div>

      <button type="submit" disabled={submitting} className="ws-btn-primary w-full">
        <Store size={15} />
        {submitting ? "Invio…" : "Invia candidatura"}
      </button>
    </form>
  );
}
