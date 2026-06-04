"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FileUp, FileText, Trash2 } from "lucide-react";

interface Doc {
  id: string;
  filename: string;
  size_bytes: number | null;
  uploaded_at: string;
  url: string | null;
}

export default function SupplierDocumentsManager() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/suppliers/documents");
      const data = await res.json();
      setDocs(data.documents ?? []);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/suppliers/documents", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Upload fallito");
      toast.success("Documento caricato");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare il documento?")) return;
    try {
      await fetch(`/api/suppliers/documents?id=${id}`, { method: "DELETE" });
      toast.success("Documento eliminato");
      await load();
    } catch {
      toast.error("Errore");
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card mt-8">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ws-dark">Documenti aziendali</h2>
          <p className="text-xs text-ws-text-light mt-1">
            Opzionale · visura, certificazioni, polizze. Visibili solo a te e all&apos;amministratore Wondersun.
          </p>
        </div>
        <label className="ws-btn-blue cursor-pointer">
          <FileUp size={15} />
          Carica documento
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
      </div>
      {docs.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-ws-text-light">
          Nessun documento caricato.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {docs.map((d) => (
            <li key={d.id} className="px-6 py-3 flex items-center gap-3">
              <FileText size={18} className="text-ws-blue" />
              <div className="flex-1">
                <a
                  href={d.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-ws-text hover:underline"
                >
                  {d.filename}
                </a>
                <p className="text-xs text-ws-text-light">
                  {(d.size_bytes ?? 0) > 0 ? `${Math.round((d.size_bytes ?? 0) / 1024)} KB · ` : ""}
                  caricato il {new Date(d.uploaded_at).toLocaleDateString("it-IT")}
                </p>
              </div>
              <button
                onClick={() => remove(d.id)}
                className="text-ws-red p-1.5 rounded hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
