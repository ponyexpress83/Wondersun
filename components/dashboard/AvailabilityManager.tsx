"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Trash2, CalendarDays, Plus, X, Repeat, CalendarClock } from "lucide-react";

interface Slot {
  id: string;
  starts_at: string;
  capacity: number;
  booked_count: number;
}

// Etichette giorni con la settimana all'italiana (lun→dom); il valore è quello
// restituito da Date.getDay() (0 = domenica … 6 = sabato).
const WEEKDAYS: { label: string; value: number }[] = [
  { label: "Lun", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Mer", value: 3 },
  { label: "Gio", value: 4 },
  { label: "Ven", value: 5 },
  { label: "Sab", value: 6 },
  { label: "Dom", value: 0 },
];

// Costruisce l'istante nel fuso ORARIO del browser: così l'ora che il fornitore
// scrive è la stessa che poi vede lui e il cliente (niente scarti di fuso).
function localISO(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

/**
 * Calendario disponibilità fornitore (Allegato A § 3.2): date con capienza.
 * Se l'esperienza ha slot, il cliente sceglie tra queste date; senza slot la
 * data resta libera (proposta nella richiesta, come da call 23/05).
 *
 * Due modalità:
 *  - Singola: una data + un orario.
 *  - Ricorrente: un periodo (dal/al), i giorni della settimana e uno o più
 *    orari → genera in un colpo solo tutte le occorrenze (es. "ogni giorno
 *    alle 10 e alle 15").
 */
export default function AvailabilityManager({ experienceId }: { experienceId: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [mode, setMode] = useState<"single" | "recurring">("single");
  const [busy, setBusy] = useState(false);

  // Modalità singola
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [capacity, setCapacity] = useState(8);

  // Modalità ricorrente
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [times, setTimes] = useState<string[]>(["10:00"]);
  const [newTime, setNewTime] = useState("15:00");

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

  const today = new Date().toISOString().split("T")[0];

  const addSingle = async () => {
    if (!date) {
      toast.error("Scegli una data");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/experiences/${experienceId}/slots`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ startsAt: localISO(date, time), capacity }),
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

  const toggleWeekday = (v: number) =>
    setWeekdays((prev) => (prev.includes(v) ? prev.filter((d) => d !== v) : [...prev, v]));

  const addTime = () => {
    if (!newTime) return;
    setTimes((prev) => (prev.includes(newTime) ? prev : [...prev, newTime].sort()));
  };

  const removeTime = (t: string) => setTimes((prev) => prev.filter((x) => x !== t));

  // Espande il periodo nelle singole occorrenze (giorni scelti × orari scelti).
  const buildOccurrences = (): string[] => {
    const out: string[] = [];
    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (!weekdays.includes(d.getDay())) continue;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${day}`;
      for (const t of times) out.push(localISO(dateStr, t));
    }
    return out;
  };

  const generateRecurring = async () => {
    if (!fromDate || !toDate) {
      toast.error("Scegli il periodo (dal / al)");
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      toast.error("La data finale deve venire dopo quella iniziale");
      return;
    }
    if (weekdays.length === 0) {
      toast.error("Seleziona almeno un giorno della settimana");
      return;
    }
    if (times.length === 0) {
      toast.error("Aggiungi almeno un orario");
      return;
    }
    const occurrences = buildOccurrences();
    if (occurrences.length === 0) {
      toast.error("Nessuna data nel periodo con i giorni scelti");
      return;
    }
    if (occurrences.length > 400) {
      toast.error(
        `Sono ${occurrences.length} date: riduci il periodo o gli orari (max 400 per volta).`,
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/experiences/${experienceId}/slots`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ startsAt: occurrences, capacity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Errore");
      toast.success(`${data.inserted ?? occurrences.length} date aggiunte al calendario`);
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

  const previewCount = mode === "recurring" && fromDate && toDate ? buildOccurrences().length : 0;

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

      {/* Scelta modalità */}
      <div className="px-6 pt-5">
        <div className="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              mode === "single" ? "bg-white text-ws-blue shadow-sm" : "text-ws-text-light"
            }`}
          >
            <CalendarClock size={15} /> Singola data
          </button>
          <button
            type="button"
            onClick={() => setMode("recurring")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              mode === "recurring" ? "bg-white text-ws-blue shadow-sm" : "text-ws-text-light"
            }`}
          >
            <Repeat size={15} /> Ricorrente
          </button>
        </div>
      </div>

      {mode === "single" ? (
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
          <button onClick={addSingle} disabled={busy} className="ws-btn-blue">
            <CalendarPlus size={15} /> Aggiungi
          </button>
        </div>
      ) : (
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="ws-label">Dal</label>
              <input
                type="date"
                min={today}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="ws-input"
              />
            </div>
            <div>
              <label className="ws-label">Al</label>
              <input
                type="date"
                min={fromDate || today}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="ws-input"
              />
            </div>
            <div>
              <label className="ws-label">Posti per orario</label>
              <input
                type="number"
                min={1}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="ws-input w-24"
              />
            </div>
          </div>

          <div>
            <label className="ws-label">Giorni della settimana</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {WEEKDAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleWeekday(d.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                    weekdays.includes(d.value)
                      ? "bg-ws-blue text-white border-ws-blue"
                      : "bg-white text-ws-text-light border-gray-200 hover:border-ws-blue"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="ws-label">Orari</label>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {times.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-lg bg-ws-blue/10 text-ws-blue text-sm font-semibold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTime(t)}
                    aria-label={`Rimuovi orario ${t}`}
                    className="p-0.5 rounded hover:bg-ws-blue/20"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="ws-input w-28"
              />
              <button
                type="button"
                onClick={addTime}
                className="ws-btn-ghost px-3 py-1.5 text-sm"
              >
                <Plus size={14} /> Aggiungi orario
              </button>
            </div>
            <p className="text-xs text-ws-text-light mt-2">
              Esempio: per i quad prenotabili ogni giorno alle 10 e alle 15, tieni tutti i
              giorni selezionati e aggiungi gli orari <strong>10:00</strong> e{" "}
              <strong>15:00</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={generateRecurring} disabled={busy} className="ws-btn-blue">
              <CalendarPlus size={15} /> Genera date
            </button>
            {previewCount > 0 && (
              <span className="text-sm text-ws-text-light">
                Verranno create <strong className="text-ws-text">{previewCount}</strong> date
              </span>
            )}
          </div>
        </div>
      )}

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
