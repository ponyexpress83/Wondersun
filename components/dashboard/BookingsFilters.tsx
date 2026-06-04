"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEur } from "@/lib/types";

interface Booking {
  id: string;
  booking_code: string;
  status: string;
  participants: number;
  requested_date: string;
  total_cents: number;
  experience?: { title?: string; cover_image_url?: string } | null;
}

const FILTERS = [
  { key: "all", label: "Tutte" },
  { key: "in_attesa", label: "In attesa", match: ["richiesta", "data_alternativa"] },
  { key: "confermate", label: "Confermate", match: ["confermata", "pagata"] },
  { key: "completate", label: "Completate", match: ["completata"] },
  { key: "annullate", label: "Annullate", match: ["annullata", "rifiutata", "no_show"] },
] as const;

export default function BookingsFilters({
  bookings,
  renderRow,
}: {
  bookings: Booking[];
  renderRow: (b: Booking) => React.ReactNode;
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = bookings.filter((b) => {
    const f = FILTERS.find((x) => x.key === filter);
    if (!f || !("match" in f)) return true;
    return (f as any).match.includes(b.status);
  });

  return (
    <>
      <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                active ? "bg-ws-blue text-white" : "bg-gray-50 text-ws-text hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-ws-text-light">
          Nessuna prenotazione in questa categoria.
          <div className="mt-3">
            <Link href="/esperienze" className="text-ws-blue font-semibold hover:underline">
              Sfoglia esperienze →
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">{filtered.map((b) => renderRow(b))}</ul>
      )}
    </>
  );
}
