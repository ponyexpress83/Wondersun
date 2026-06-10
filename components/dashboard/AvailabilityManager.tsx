"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Trash2, CalendarDays } from "lucide-react";

interface Slot {
  id: string;
  starts_at: string;
  capacity: number;
  booked_count: number;
}

/**
 * Calendario disponibilità fornitore (Allegato A § 3.2): date con capienza.
 * Se l'esperienza ha slot, il cliente sceglie tra queste date; senza slot la
 * data resta libera (proposta nella richiesta, come da call 23/05).
 */
export default function AvailabilityManager({ experienceId }: { experienceId: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [capacity, setCapacity] = useState(8);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`/api/experiences/${experienceId}/slots`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {}
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId]);

  const add = async () => {
    if (!date) {
      toast.error("Scegli una data");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/experiences/${experienceId}/slots`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ startsAt: `${date}T${time}:00`, capacity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success("Disponibilità aggiunta");
      setDate("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (slotId: string) => {
    try {
      await fetch(`/api/experiences/${experienceId}/slots?slotId=${slotId}`, {
        method: "DELETE",
      });
      toast.success("Slot rimosso");
      await load();
    } catch {
      toast.error("Errore");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card mt-8">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-display text-xl font-bold text-ws-dark flex items-center gap-2">
          <CalendarDays size={20} className="text-ws-blue" /> Calendario disponibilità
        </h2>
        <p className="text-xs text-ws-text-light mt-1">
          Aggiungi le date in cui l&apos;esperienza è disponibile. Se non inserisci date, il
          cliente proporrà liberamente una data nella richiesta.
        </p>
      </div>

      <div className="p-6 border-b border-gray-100 flex flex-wrap items-end gap-3">
        <div>
          <label className="ws-label">Data</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ws-input"
          />
        </div>
        <div>
          <label className="ws-label">Ora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="ws-input"
          />
        </div>
        <div>
          <label className="ws-label">Posti</label>
          <input
            type="number"
            min={1}
            max={500}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="ws-input w-24"
          />
        </div>
        <button onClick={add} disabled={busy} className="ws-btn-blue">
          <CalendarPlus size={15} /> Aggiungi
        </button>
      </div>

      {slots.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-ws-text-light">
          Nessuna data a calendario: il cliente propone liberamente la data.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {slots.map((s) => (
            <li key={s.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-ws-text">
                  {new Date(s.starts_at).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  ·{" "}
                  {new Date(s.starts_at).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-ws-text-light">
                  {s.booked_count}/{s.capacity} posti prenotati
                </p>
              </div>
              <button
                onClick={() => remove(s.id)}
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
