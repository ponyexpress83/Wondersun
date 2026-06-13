"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { AREAS } from "@/lib/types";

/**
 * Search bar centrale stile GetYourGuide: zona + data + partecipanti.
 * Bonus: link "Chiedi a Sole" che apre il chatbot AI per ricerca conversazionale.
 */
export default function HeroSearchBar() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(2);

  const today = new Date().toISOString().split("T")[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (date) params.set("date", date);
    if (participants) params.set("participants", String(participants));
    router.push(`/esperienze${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const openSole = () => {
    // Trigger global Sole chatbot toggle (component listens to this event)
    window.dispatchEvent(new CustomEvent("ws-open-sole"));
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl p-3 shadow-[0_30px_80px_-15px_rgba(11,61,107,0.45)] grid grid-cols-1 md:grid-cols-[1.2fr_1fr_0.9fr_auto] gap-2 md:gap-1 border border-white/40"
    >
      <label className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-ws-ivory transition-colors cursor-pointer group">
        <MapPin size={20} className="text-ws-blue flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[0.65rem] font-bold uppercase tracking-wider text-ws-text-light">
            Dove
          </div>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-transparent font-bold text-ws-dark outline-none cursor-pointer"
          >
            <option value="">Tutta la Maremma</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-ws-ivory transition-colors cursor-pointer border-l md:border-l border-gray-100">
        <Calendar size={20} className="text-ws-blue flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[0.65rem] font-bold uppercase tracking-wider text-ws-text-light">
            Quando
          </div>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent font-bold text-ws-dark outline-none cursor-pointer"
            placeholder="Aggiungi data"
          />
        </div>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-ws-ivory transition-colors cursor-pointer border-l border-gray-100">
        <Users size={20} className="text-ws-blue flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[0.65rem] font-bold uppercase tracking-wider text-ws-text-light">
            Quanti
          </div>
          <input
            type="number"
            min={1}
            max={20}
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className="w-full bg-transparent font-bold text-ws-dark outline-none"
          />
        </div>
      </label>

      <button
        type="submit"
        className="ws-btn-primary text-sm py-4 px-7 md:px-6 whitespace-nowrap"
        aria-label="Cerca esperienze"
      >
        <Search size={18} />
        <span>Cerca</span>
      </button>

      {/* Sole AI shortcut */}
      <button
        type="button"
        onClick={openSole}
        className="md:col-span-4 mt-1 mx-auto flex items-center gap-2 text-xs font-bold text-ws-blue hover:text-ws-blue-dark transition-colors py-2"
      >
        <Sparkles size={14} className="text-ws-yellow-dark" />
        <span>
          Oppure <u>chiedi a Sole</u>, il concierge AI: <em>“vorrei una giornata di mare e cena di pesce”</em>
        </span>
      </button>
    </form>
  );
}
