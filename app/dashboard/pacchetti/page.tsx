import Link from "next/link";
import { Heart, Calendar, User, Package, Compass } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PackageBuilder from "@/components/dashboard/PackageBuilder";
import { requireProfile } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";

export const metadata = { title: "I miei pacchetti" };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  richiesta: { label: "In attesa fornitore", cls: "ws-badge-yellow" },
  confermata: { label: "Confermata", cls: "ws-badge-green" },
  rifiutata: { label: "Rifiutata", cls: "ws-badge-red" },
  data_alternativa: { label: "Data alternativa", cls: "ws-badge-yellow" },
  pagata: { label: "Pagata", cls: "ws-badge-green" },
  completata: { label: "Completata", cls: "ws-badge-blue" },
  annullata: { label: "Annullata", cls: "ws-badge-red" },
  no_show: { label: "No-show", cls: "ws-badge-red" },
};

export default async function ClientPackagesPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: packages = [] } = await supabase
    .from("packages")
    .select("id, name, status, created_at")
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false });

  const cart = (packages as any[]).find((p) => p.status === "bozza") ?? null;
  const submitted = (packages as any[]).filter((p) => p.status !== "bozza");

  const { data: cartItems = [] } = cart
    ? await supabase
        .from("package_items")
        .select(
          "id, requested_date, participants, experience:experiences(slug, title, cover_image_url, price_cents, min_participants, max_participants)",
        )
        .eq("package_id", cart.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const submittedIds = submitted.map((p) => p.id);
  const { data: submittedBookings = [] } = submittedIds.length
    ? await supabase
        .from("bookings")
        .select(
          "id, booking_code, status, requested_date, participants, total_cents, commission_cents, package_id, experience:experiences(title, cover_image_url)",
        )
        .in("package_id", submittedIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const bookingsByPackage = (submittedBookings as any[]).reduce<Record<string, any[]>>((acc, b) => {
    (acc[b.package_id] ??= []).push(b);
    return acc;
  }, {});

  const nav = [
    { href: "/dashboard", label: "Panoramica", icon: User },
    { href: "/esperienze", label: "Scopri esperienze", icon: Compass },
    { href: "/dashboard?tab=bookings", label: "Le mie prenotazioni", icon: Calendar },
    { href: "/dashboard?tab=favorites", label: "I miei preferiti", icon: Heart },
    { href: "/dashboard/pacchetti", label: "I miei pacchetti", icon: Package },
  ];

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title="I miei pacchetti"
      subtitle="Componi più esperienze e invia tutte le richieste in una volta: ogni fornitore conferma la propria in autonomia."
    >
      {/* Carrello in composizione */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card mb-8">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ws-dark">Pacchetto in composizione</h2>
          <Link href="/esperienze" className="text-sm font-semibold text-ws-blue hover:underline">
            Aggiungi esperienze
          </Link>
        </div>
        <div className="px-6 py-5">
          {cart && (cartItems as any[]).length > 0 ? (
            <PackageBuilder packageId={cart.id} items={cartItems as any[]} />
          ) : (
            <div className="text-center py-6">
              <Package size={40} className="text-ws-text-light mx-auto mb-3" />
              <p className="text-ws-text-light mb-4">
                Il tuo pacchetto è vuoto. Sfoglia il catalogo e usa “Aggiungi a un pacchetto”.
              </p>
              <Link href="/esperienze" className="ws-btn-blue">
                <Compass size={15} /> Sfoglia esperienze
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Pacchetti inviati */}
      {submitted.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-ws-dark">Pacchetti inviati</h2>
          {submitted.map((p) => {
            const bookings = bookingsByPackage[p.id] ?? [];
            const confirmed = bookings.filter((b) =>
              ["confermata", "pagata", "completata"].includes(b.status),
            ).length;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-ws-card overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ws-text">{p.name}</p>
                    <p className="text-xs text-ws-text-light">
                      Inviato il {new Date(p.created_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <span className="ws-badge ws-badge-blue text-[0.65rem]">
                    {confirmed}/{bookings.length} confermate
                  </span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {bookings.map((b) => {
                    const meta = STATUS_META[b.status] ?? { label: b.status, cls: "ws-badge-blue" };
                    return (
                      <li key={b.id} className="px-6 py-3 flex items-center gap-4">
                        {b.experience?.cover_image_url && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={b.experience.cover_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ws-text truncate">
                            {b.experience?.title}
                          </p>
                          <p className="text-xs text-ws-text-light">
                            {b.booking_code} · {b.participants} pax ·{" "}
                            {new Date(b.requested_date).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`ws-badge ${meta.cls} text-[0.65rem]`}>{meta.label}</span>
                          <p className="text-sm font-bold text-ws-text mt-1">
                            {formatEur(b.total_cents)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="px-6 py-3 bg-ws-ivory/50">
                  <Link href="/dashboard" className="text-xs font-semibold text-ws-blue hover:underline">
                    Gestisci le singole prenotazioni →
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </DashboardLayout>
  );
}
