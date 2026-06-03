"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface PageItem {
  slug: string;
  title: string;
  body_md: string;
  updated_at: string | null;
}

export default function ContentEditor({ pages }: { pages: PageItem[] }) {
  const router = useRouter();
  const [active, setActive] = useState(pages[0]?.slug ?? "");
  const [drafts, setDrafts] = useState<Record<string, { title: string; body_md: string }>>(
    Object.fromEntries(pages.map((p) => [p.slug, { title: p.title, body_md: p.body_md }])),
  );
  const [busy, setBusy] = useState(false);

  const current = pages.find((p) => p.slug === active)!;
  const draft = drafts[active] ?? { title: current.title, body_md: current.body_md };

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: active, ...draft }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Errore");
      }
      toast.success("Contenuto salvato");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
      <nav className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-3 h-fit">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActive(p.slug)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              active === p.slug ? "bg-ws-blue/10 text-ws-blue" : "text-ws-text hover:bg-gray-50"
            }`}
          >
            {p.title}
            {p.updated_at && (
              <span className="block text-[0.65rem] text-ws-text-light font-normal">
                {new Date(p.updated_at).toLocaleDateString("it-IT")}
              </span>
            )}
          </button>
        ))}
      </nav>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6">
        <label className="ws-label">Titolo</label>
        <input
          value={draft.title}
          onChange={(e) =>
            setDrafts((d) => ({ ...d, [active]: { ...draft, title: e.target.value } }))
          }
          className="ws-input mb-4"
        />

        <label className="ws-label">Contenuto (markdown)</label>
        <textarea
          value={draft.body_md}
          onChange={(e) =>
            setDrafts((d) => ({ ...d, [active]: { ...draft, body_md: e.target.value } }))
          }
          rows={20}
          className="ws-input font-mono text-sm"
        />

        <div className="flex justify-end mt-4">
          <button onClick={save} disabled={busy} className="ws-btn-blue">
            <Save size={15} />
            {busy ? "Salvataggio…" : "Salva contenuto"}
          </button>
        </div>
      </section>
    </div>
  );
}
