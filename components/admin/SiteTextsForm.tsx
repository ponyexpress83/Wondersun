"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, RotateCcw } from "lucide-react";
import { SITE_TEXTS, settingKeyFor, type SiteTexts } from "@/lib/site-texts-def";

/**
 * Modifica dei testi del sito dal pannello (Allegato A § 4.1).
 * Ogni campo mostra il testo attuale; svuotandolo si torna a quello predefinito.
 */
export default function SiteTextsForm({ initial }: { initial: SiteTexts }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteTexts>(initial);
  const [saving, setSaving] = useState(false);

  const groups = Array.from(new Set(SITE_TEXTS.map((t) => t.group)));

  const save = async () => {
    setSaving(true);
    try {
      for (const field of SITE_TEXTS) {
        const value = (values[field.key] ?? "").trim();
        // Salviamo solo ciò che è diverso dal testo di partenza.
        if (value === (initial[field.key] ?? "").trim()) continue;
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: settingKeyFor(field.key), value: value || null }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Salvataggio non riuscito");
      }
      toast.success("Testi aggiornati: ricarica il sito per vederli");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-gray-600">
        Modifica i testi delle sezioni del sito. Se svuoti un campo viene ripristinato il testo
        predefinito. Le modifiche sono visibili sul sito subito dopo il salvataggio.
      </p>

      {groups.map((group) => (
        <section
          key={group}
          className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6"
        >
          <h2 className="font-display text-lg font-bold text-ws-dark mb-4">{group}</h2>
          <div className="space-y-4">
            {SITE_TEXTS.filter((t) => t.group === group).map((field) => (
              <div key={field.key}>
                <label className="ws-label" htmlFor={field.key}>
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    id={field.key}
                    rows={3}
                    className="ws-input resize-y"
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  />
                ) : (
                  <input
                    id={field.key}
                    className="ws-input"
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  />
                )}
                {values[field.key] !== field.fallback && (
                  <button
                    type="button"
                    onClick={() => setValues({ ...values, [field.key]: field.fallback })}
                    className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-ws-text-light hover:text-ws-blue"
                  >
                    <RotateCcw size={11} /> Ripristina testo originale
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <button onClick={save} disabled={saving} className="ws-btn-blue">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? "Salvataggio…" : "Salva i testi"}
      </button>
    </div>
  );
}
