"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEur } from "@/lib/types";
import ClientBookingActions from "@/components/dashboard/ClientBookingActions";

interface Booking {
  id: string;
  booking_code: string;
  status: string;
  participants: number;
  requested_date: string;
  total_cents: number;
  commission_cents?: number | null;
  alternative_date?: string | null;
  experience?: { title?: string; cover_image_url?: string } | null;
}

const FILTERS = [
  { key: "all", label: "Tutte" },
  { key: "in_attesa", label: "In attesa", match: ["richiesta", "data_alternativa"] },
  { key: "confermate", label: "Confermate", match: ["confermata", "pagata"] },
  { key: "completate", label: "Completate", match: ["completata"] },
  { key: "annullate", label: "Annullate", match: ["annullata", "rifiutata", "no_show"] },
] as const;

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  richiesta: { label: "In attesa fornitore", cls: "ws-badge-yellow" },
  confermata: { label: "Confermata", cls: "ws-badge-green" },
  rifiutata: { label: "Rifiutata", cls: "ws-badge-red" },
  data_alternativa: { label: "Data alternativa proposta", cls: "ws-badge-yellow" },
  pagata: { label: "Pagata", cls: "ws-badge-green" },
  completata: { label: "Completata", cls: "ws-badge-blue" },
  annullata: { label: "Annullata", cls: "ws-badge-red" },
  no_show: { label: "No-show", cls: "ws-badge-red" },
};

function BookingStatusBadge({ status }: { status: string }) {
  const meta = STATUS_MAP[status] ?? { label: status, cls: "ws-badge-blue" };
  return <span className={`ws-badge ${meta.cls}`}>{meta.label}</span>;
}

export default function BookingsFilters({ bookings }: { bookings: Booking[] }) {
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
        <ul className="divide-y divide-gray-100">
          {filtered.map((b) => (
            <li key={b.id} className="px-6 py-4 flex items-center gap-4">
              {b.experience?.cover_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={b.experience.cover_image_url}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ws-text truncate">{b.experience?.title}</p>
                <p className="text-xs text-ws-text-light">
                  {b.booking_code} · {b.participants} partecipanti ·{" "}
                  {new Date(b.requested_date).toLocaleDateString("it-IT")}
                </p>
              </div>
              <div className="text-right">
                <BookingStatusBadge status={b.status} />
                <p className="text-sm font-bold text-ws-text mt-1">{formatEur(b.total_cents)}</p>
                <ClientBookingActions
                  bookingId={b.id}
                  status={b.status}
                  alternativeDate={b.alternative_date ?? undefined}
                  payNowCents={b.commission_cents ?? 0}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
