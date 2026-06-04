"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Send, CalendarDays, Users } from "lucide-react";
import { formatEur } from "@/lib/types";

interface Item {
  id: string;
  requested_date: string | null;
  participants: number;
  experience: {
    slug: string;
    title: string;
    cover_image_url: string | null;
    price_cents: number;
    min_participants: number;
    max_participants: number;
  };
}

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
const TODAY = new Date().toISOString().slice(0, 10);

export default function PackageBuilder({
  packageId,
  items: initialItems,
}: {
  packageId: string;
  items: Item[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [busy, setBusy] = useState(false);

  const patchItem = async (itemId: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/packages/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Errore di salvataggio");
      router.refresh();
    }
  };

  const setDate = (itemId: string, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, requested_date: value || null } : it)),
    );
    patchItem(itemId, { requestedDate: value || null });
  };

  const setPax = (itemId: string, value: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, participants: value } : it)),
    );
    patchItem(itemId, { participants: value });
  };

  const removeItem = async (itemId: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/packages/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Impossibile rimuovere la voce");
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (items.some((it) => !it.requested_date)) {
      toast.error("Scegli una data per ogni esperienza prima di inviare.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Errore");
      toast.success(`${data.count} richieste inviate`, {
        description: "Ogni fornitore confermerà la propria esperienza in autonomia.",
      });
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-ws-text-light text-sm">
        Il tuo pacchetto è vuoto. Aggiungi esperienze dal catalogo.
      </p>
    );
  }

  const total = items.reduce((sum, it) => sum + it.experience.price_cents * it.participants, 0);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-ws-ivory rounded-xl p-3 border border-gray-100"
          >
            {it.experience.cover_image_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={it.experience.cover_image_url}
                alt=""
                className="w-full sm:w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ws-text truncate">{it.experience.title}</p>
              <p className="text-xs text-ws-text-light mb-2">
                {formatEur(it.experience.price_cents)} a persona
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-ws-text">
                  <CalendarDays size={13} className="text-ws-blue" />
                  <input
                    type="date"
                    min={TODAY}
                    value={toDateInput(it.requested_date)}
                    onChange={(e) => setDate(it.id, e.target.value)}
                    className="ws-input py-1 px-2 text-xs"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-xs text-ws-text">
                  <Users size={13} className="text-ws-blue" />
                  <input
                    type="number"
                    min={it.experience.min_participants}
                    max={it.experience.max_participants}
                    value={it.participants}
                    onChange={(e) => setPax(it.id, Number(e.target.value))}
                    className="ws-input py-1 px-2 text-xs w-20"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={() => removeItem(it.id)}
              disabled={busy}
              aria-label="Rimuovi"
              className="text-ws-text-light hover:text-ws-red self-start sm:self-center disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="text-sm text-ws-text-light">
          Valore totale esperienze:{" "}
          <strong className="text-ws-text">{formatEur(total)}</strong>
        </p>
        <button onClick={submit} disabled={busy} className="ws-btn-primary disabled:opacity-50">
          <Send size={15} /> Invia tutte le richieste
        </button>
      </div>
    </div>
  );
}
