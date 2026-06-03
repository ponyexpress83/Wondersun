"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Tpl {
  slug: string;
  title: string;
  subject: string;
  body_md: string;
  updated_at: string | null;
}

export default function EmailTemplateEditor({ templates }: { templates: Tpl[] }) {
  const router = useRouter();
  const [active, setActive] = useState(templates[0]?.slug ?? "");
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body_md: string }>>(
    Object.fromEntries(templates.map((t) => [t.slug, { subject: t.subject, body_md: t.body_md }])),
  );
  const [busy, setBusy] = useState(false);

  const current = templates.find((t) => t.slug === active)!;
  const draft = drafts[active] ?? { subject: current.subject, body_md: current.body_md };

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: active, ...draft }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Errore");
      }
      toast.success("Template salvato");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <nav className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-3 h-fit">
        {templates.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActive(t.slug)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              active === t.slug ? "bg-ws-blue/10 text-ws-blue" : "text-ws-text hover:bg-gray-50"
            }`}
          >
            {t.title}
            {t.updated_at && (
              <span className="block text-[0.65rem] text-ws-text-light font-normal">
                modificato {new Date(t.updated_at).toLocaleDateString("it-IT")}
              </span>
            )}
          </button>
        ))}
      </nav>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6">
        <label className="ws-label">Oggetto</label>
        <input
          value={draft.subject}
          onChange={(e) =>
            setDrafts((d) => ({ ...d, [active]: { ...draft, subject: e.target.value } }))
          }
          className="ws-input mb-4"
        />
        <label className="ws-label">Corpo (markdown)</label>
        <textarea
          value={draft.body_md}
          onChange={(e) =>
            setDrafts((d) => ({ ...d, [active]: { ...draft, body_md: e.target.value } }))
          }
          rows={18}
          className="ws-input font-mono text-sm"
        />
        <div className="flex justify-end mt-4">
          <button onClick={save} disabled={busy} className="ws-btn-blue">
            <Save size={15} />
            {busy ? "Salvataggio…" : "Salva template"}
          </button>
        </div>
      </section>
    </div>
  );
}
