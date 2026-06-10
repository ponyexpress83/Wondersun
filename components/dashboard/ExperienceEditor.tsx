"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Trash2, Upload, AlertCircle } from "lucide-react";
import { CATEGORIES, AREAS, type Experience } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface Props {
  supplierId: string;
  experience?: Experience;
  /** 'vetrina' = la scheda viene pubblicata senza prenotazione (recapiti diretti). */
  supplierMode?: "prenotabile" | "vetrina";
}

export default function ExperienceEditor({ supplierId, experience, supplierMode }: Props) {
  const isVetrina = supplierMode === "vetrina";
  const router = useRouter();
  const isEdit = !!experience;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState(experience?.cover_image_url ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, publish: boolean) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      supplier_id: supplierId,
      title: fd.get("title"),
      slug: slugify(String(fd.get("title") || "")),
      short_description: fd.get("short_description"),
      description: fd.get("description"),
      category: fd.get("category"),
      tag: fd.get("tag") || null,
      duration_label: fd.get("duration_label"),
      duration_hours: Number(fd.get("duration_hours") || 0),
      min_participants: Number(fd.get("min_participants") || 1),
      max_participants: Number(fd.get("max_participants") || 10),
      price_cents: Math.round(Number(fd.get("price_euro") || 0) * 100),
      price_type: fd.get("price_type"),
      requires_request: fd.get("requires_request") === "on",
      location_name: fd.get("location_name"),
      location_area: fd.get("location_area"),
      latitude: fd.get("latitude") ? Number(fd.get("latitude")) : null,
      longitude: fd.get("longitude") ? Number(fd.get("longitude")) : null,
      cover_image_url: coverUrl || null,
      status: publish ? "pubblicata" : "bozza",
    };

    try {
      const url = isEdit ? `/api/experiences/${experience!.id}` : "/api/experiences";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Errore durante il salvataggio");
      }
      toast.success(publish ? "Esperienza pubblicata!" : "Bozza salvata");
      router.push("/fornitore/esperienze");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore imprevisto";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "experience-covers");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore upload");
      setCoverUrl(data.url);
      toast.success("Immagine caricata");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!confirm("Eliminare definitivamente questa esperienza?")) return;
    try {
      const res = await fetch(`/api/experiences/${experience!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Esperienza eliminata");
      router.push("/fornitore/esperienze");
      router.refresh();
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, true)}
      className="bg-white rounded-2xl border border-gray-100 shadow-ws-card p-6 lg:p-8 max-w-4xl space-y-6"
    >
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-ws-red">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="ws-label">
          Titolo *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={experience?.title}
          className="ws-input"
          placeholder="Es. Navigazione al Tramonto sull'Argentario"
        />
      </div>

      <div>
        <label htmlFor="short_description" className="ws-label">
          Sottotitolo (max 140 caratteri)
        </label>
        <input
          id="short_description"
          name="short_description"
          maxLength={140}
          defaultValue={experience?.short_description ?? ""}
          className="ws-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="ws-label">
          Descrizione completa *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={experience?.description ?? ""}
          className="ws-input resize-y"
        />
      </div>

      <div>
        <label className="ws-label">Immagine di copertina</label>
        {coverUrl ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt=""
              className="w-64 h-40 object-cover rounded-xl border border-gray-100"
            />
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-ws-red hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-64 h-40 border-2 border-dashed border-gray-200 rounded-xl text-ws-text-light hover:border-ws-blue hover:text-ws-blue cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />
            <div className="text-center">
              <Upload size={24} className="mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {uploadingImage ? "Caricamento…" : "Carica immagine"}
              </span>
            </div>
          </label>
        )}
        <p className="text-xs text-ws-text-light mt-2">
          Oppure incolla un URL pubblico:
        </p>
        <input
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://…"
          className="ws-input mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="ws-label">
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={experience?.category}
            className="ws-input"
          >
            <option value="">Seleziona…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tag" className="ws-label">
            Tag (opzionale)
          </label>
          <input
            id="tag"
            name="tag"
            defaultValue={experience?.tag ?? ""}
            placeholder="Es. Più Prenotata"
            className="ws-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="duration_label" className="ws-label">
            Durata (testo) *
          </label>
          <input
            id="duration_label"
            name="duration_label"
            required
            defaultValue={experience?.duration_label ?? ""}
            placeholder="Es. 3 ore"
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="duration_hours" className="ws-label">
            Durata (ore)
          </label>
          <input
            id="duration_hours"
            name="duration_hours"
            type="number"
            step="0.5"
            min={0}
            defaultValue={experience?.duration_hours ?? ""}
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="price_type" className="ws-label">
            Tipo prezzo *
          </label>
          <select
            id="price_type"
            name="price_type"
            defaultValue={experience?.price_type ?? "pro_capite"}
            className="ws-input"
          >
            <option value="pro_capite">Per persona</option>
            <option value="gruppo">Per gruppo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="min_participants" className="ws-label">
            Min partecipanti
          </label>
          <input
            id="min_participants"
            name="min_participants"
            type="number"
            min={1}
            required
            defaultValue={experience?.min_participants ?? 1}
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="max_participants" className="ws-label">
            Max partecipanti
          </label>
          <input
            id="max_participants"
            name="max_participants"
            type="number"
            min={1}
            required
            defaultValue={experience?.max_participants ?? 10}
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="price_euro" className="ws-label">
            Prezzo (€)
          </label>
          <input
            id="price_euro"
            name="price_euro"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={experience ? (experience.price_cents / 100).toFixed(2) : ""}
            className="ws-input"
          />
        </div>
      </div>

      {isVetrina ? (
        <div className="rounded-xl border border-ws-blue/20 p-4 bg-ws-blue-pale/40 text-sm text-ws-blue-dark">
          <strong>Modalità vetrina.</strong> Questa scheda viene pubblicata senza prenotazione in
          piattaforma: i clienti vedranno i tuoi recapiti diretti (telefono, WhatsApp, email,
          sito) e ti contatteranno direttamente. Il prezzo, se indicato, è mostrato come
          indicativo.
        </div>
      ) : (
      <div className="rounded-xl border border-gray-200 p-4 bg-ws-ivory">
        <label htmlFor="requires_request" className="flex items-start gap-3 cursor-pointer">
          <input
            id="requires_request"
            name="requires_request"
            type="checkbox"
            defaultChecked={experience?.requires_request ?? false}
            className="mt-1 h-4 w-4 accent-ws-blue"
          />
          <span>
            <span className="font-semibold text-sm text-ws-text">
              Esperienza premium “a richiesta”
            </span>
            <span className="block text-xs text-ws-text-light mt-0.5">
              Attiva se la prenotazione richiede la tua conferma (es. uscite in barca,
              immersioni, charter). Il cliente invia una richiesta e tu confermi o proponi una
              data alternativa. Se disattivato la prenotazione è diretta.
            </span>
          </span>
        </label>
      </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location_name" className="ws-label">
            Località *
          </label>
          <input
            id="location_name"
            name="location_name"
            required
            defaultValue={experience?.location_name ?? ""}
            placeholder="Es. Porto Santo Stefano"
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="location_area" className="ws-label">
            Zona Maremma *
          </label>
          <select
            id="location_area"
            name="location_area"
            required
            defaultValue={experience?.location_area ?? ""}
            className="ws-input"
          >
            <option value="">Seleziona…</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="ws-label">
            Latitudine (opzionale)
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={experience?.latitude ?? ""}
            className="ws-input"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="ws-label">
            Longitudine (opzionale)
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={experience?.longitude ?? ""}
            className="ws-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button type="submit" disabled={submitting} className="ws-btn-primary">
          <Save size={15} />
          {submitting ? "Salvataggio…" : "Pubblica"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            const form = (e.target as HTMLElement).closest("form");
            if (form) handleSubmit({ preventDefault: () => {}, currentTarget: form } as any, false);
          }}
          disabled={submitting}
          className="ws-btn-ghost"
        >
          Salva come bozza
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ws-btn-ghost text-ws-red border-red-100 hover:border-ws-red ml-auto"
          >
            <Trash2 size={14} /> Elimina
          </button>
        )}
      </div>
    </form>
  );
}
