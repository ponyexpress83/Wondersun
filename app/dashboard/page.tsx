import Link from "next/link";
import { Heart, Calendar, User, Package, Compass } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ClientBookingActions from "@/components/dashboard/ClientBookingActions";
import { requireProfile } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";
import type { Booking, Experience } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function ClientDashboardPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: bookings = [] } = await supabase
    .from("bookings")
    .select("*, experience:experiences(title, slug, cover_image_url, location_name)")
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: favorites = [] } = await supabase
    .from("favorites")
    .select("experience:experiences(id, slug, title, cover_image_url, category, price_cents)")
    .eq("client_id", profile.id);

  const nav = [
    { href: "/dashboard", label: "Panoramica", icon: User },
    { href: "/esperienze", label: "Scopri esperienze", icon: Compass },
    { href: "/dashboard?tab=bookings", label: "Le mie prenotazioni", icon: Calendar },
    { href: "/dashboard?tab=favorites", label: "I miei preferiti", icon: Heart },
    { href: "/dashboard?tab=packages", label: "I miei pacchetti", icon: Package },
  ];

  const upcomingBookings = (bookings as any[]).filter((b) =>
    ["richiesta", "confermata", "pagata", "data_alternativa"].includes(b.status),
  );

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title={`Ciao, ${profile.full_name?.split(" ")[0] ?? "viaggiatore"}`}
      subtitle="Tutte le tue esperienze maremmane in un solo posto."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Prenotazioni totali" value={String((bookings as any[]).length)} />
        <StatCard label="In arrivo" value={String(upcomingBookings.length)} highlight />
        <StatCard label="Preferiti" value={String((favorites as any[]).length)} />
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card mb-8">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ws-dark">Le tue prenotazioni</h2>
          <Link href="/esperienze" className="text-sm font-semibold text-ws-blue hover:underline">
            Nuova richiesta
          </Link>
        </div>
        {(bookings as any[]).length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Calendar size={40} className="text-ws-text-light mx-auto mb-3" />
            <p className="text-ws-text-light mb-4">
              Non hai ancora prenotato esperienze. Esplora il catalogo per iniziare.
            </p>
            <Link href="/esperienze" className="ws-btn-blue">
              <Compass size={15} /> Sfoglia esperienze
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {(bookings as any[]).map((b) => (
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
                    alternativeDate={b.alternative_date}
                    payNowCents={b.commission_cents ?? 0}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-display text-2xl font-bold text-ws-dark">Preferiti</h2>
        </div>
        {(favorites as any[]).length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Heart size={40} className="text-ws-text-light mx-auto mb-3" />
            <p className="text-ws-text-light">Non hai ancora salvato esperienze nei preferiti.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {(favorites as any[]).map((f) => (
              <Link
                key={f.experience.id}
                href={`/esperienze/${f.experience.slug}`}
                className="group block bg-ws-ivory rounded-xl overflow-hidden border border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.experience.cover_image_url}
                  alt=""
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3">
                  <p className="text-xs text-ws-text-light">{f.experience.category}</p>
                  <p className="font-bold text-sm text-ws-text">{f.experience.title}</p>
                  <p className="text-sm font-bold text-ws-blue mt-1">
                    {formatEur(f.experience.price_cents)}
                  </p>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${highlight ? "bg-ws-blue text-white border-ws-blue" : "bg-white border-gray-100"} shadow-ws-card`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlight ? "text-white/70" : "text-ws-text-light"}`}
      >
        {label}
      </p>
      <p className={`font-display text-4xl font-bold ${highlight ? "text-white" : "text-ws-blue"}`}>
        {value}
      </p>
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    richiesta: { label: "In attesa fornitore", cls: "ws-badge-yellow" },
    confermata: { label: "Confermata", cls: "ws-badge-green" },
    rifiutata: { label: "Rifiutata", cls: "ws-badge-red" },
    data_alternativa: { label: "Data alternativa proposta", cls: "ws-badge-yellow" },
    pagata: { label: "Pagata", cls: "ws-badge-green" },
    completata: { label: "Completata", cls: "ws-badge-blue" },
    annullata: { label: "Annullata", cls: "ws-badge-red" },
    no_show: { label: "No-show", cls: "ws-badge-red" },
  };
  const meta = map[status] ?? { label: status, cls: "ws-badge-blue" };
  return <span className={`ws-badge ${meta.cls}`}>{meta.label}</span>;
}
