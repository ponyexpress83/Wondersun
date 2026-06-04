import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  Calendar,
  CreditCard,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SupplierDocumentsManager from "@/components/dashboard/SupplierDocumentsManager";
import { requireProfile } from "@/lib/supabase/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/types";
import type { Supplier } from "@/lib/types";

export const metadata = { title: "Dashboard Fornitore" };

export default async function SupplierDashboardPage() {
  const profile = await requireProfile();

  if (profile.role !== "fornitore" && profile.role !== "admin") {
    return (
      <DashboardLayout
        profile={profile}
        nav={[]}
        title="Area riservata fornitori"
        subtitle="Solo gli utenti fornitore possono accedere a questa area."
      >
        <Link href="/fornitore/registrati" className="ws-btn-primary">
          Diventa fornitore
        </Link>
      </DashboardLayout>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const nav = [
    { href: "/fornitore/dashboard", label: "Panoramica", icon: LayoutDashboard },
    { href: "/fornitore/esperienze", label: "Le mie esperienze", icon: Compass },
    { href: "/fornitore/prenotazioni", label: "Prenotazioni", icon: Calendar },
    { href: "/fornitore/abbonamento", label: "Abbonamento", icon: CreditCard },
  ];

  if (!supplier) {
    return (
      <DashboardLayout
        profile={profile}
        nav={nav}
        title="Completa la registrazione"
        subtitle="Non hai ancora compilato i dati della tua attività."
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-xl shadow-ws-card">
          <p className="text-ws-text mb-4">
            Per pubblicare esperienze e ricevere prenotazioni devi prima inserire i dati della tua
            attività.
          </p>
          <Link href="/fornitore/registrati" className="ws-btn-primary">
            Completa la registrazione
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const s = supplier as Supplier;

  const { data: experiences = [] } = await supabase
    .from("experiences")
    .select("id, title, status, bookings_count, price_cents")
    .eq("supplier_id", s.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: bookings = [] } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, participants, requested_date, total_cents, supplier_payout_cents, experience:experiences(title)",
    )
    .eq("supplier_id", s.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const pendingBookings = (bookings as any[]).filter((b) => b.status === "richiesta");
  const totalRevenue = (bookings as any[])
    .filter((b) => ["pagata", "completata"].includes(b.status))
    .reduce((sum, b) => sum + (b.supplier_payout_cents ?? 0), 0);

  return (
    <DashboardLayout
      profile={profile}
      nav={nav}
      title={s.business_name}
      subtitle={s.city ? `${s.city}${s.province ? ` (${s.province})` : ""}` : ""}
    >
      {/* Status banner */}
      <SupplierStatusBanner supplier={s} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Esperienze" value={String((experiences as any[]).length)} />
        <StatCard label="Richieste in attesa" value={String(pendingBookings.length)} highlight />
        <StatCard label="Prenotazioni totali" value={String((bookings as any[]).length)} />
        <StatCard label="Incassato (netto)" value={formatEur(totalRevenue)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ws-dark">Le tue esperienze</h2>
            <Link
              href="/fornitore/esperienze/nuova"
              className="ws-btn-blue text-xs py-2 px-3"
            >
              <PlusCircle size={14} /> Nuova
            </Link>
          </div>
          {(experiences as any[]).length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Compass size={36} className="text-ws-text-light mx-auto mb-3" />
              <p className="text-sm text-ws-text-light mb-4">
                Non hai ancora creato esperienze.
              </p>
              <Link href="/fornitore/esperienze/nuova" className="ws-btn-primary text-sm py-2.5 px-5">
                Crea la prima esperienza
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {(experiences as any[]).map((e) => (
                <li key={e.id} className="px-6 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ws-text truncate">{e.title}</p>
                    <p className="text-xs text-ws-text-light">
                      {e.bookings_count} prenotazioni · {formatEur(e.price_cents)}
                    </p>
                  </div>
                  <ExperienceStatusPill status={e.status} />
                  <Link
                    href={`/fornitore/esperienze/${e.id}`}
                    className="text-xs font-semibold text-ws-blue hover:underline"
                  >
                    Modifica
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-ws-card">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-display text-xl font-bold text-ws-dark">Ultime prenotazioni</h2>
          </div>
          {(bookings as any[]).length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Calendar size={36} className="text-ws-text-light mx-auto mb-3" />
              <p className="text-sm text-ws-text-light">Nessuna richiesta ricevuta finora.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {(bookings as any[]).map((b) => (
                <li key={b.id} className="px-6 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-ws-text">{b.experience?.title}</p>
                    <BookingStatusPill status={b.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-ws-text-light">
                    <span>
                      {b.booking_code} · {b.participants} pax ·{" "}
                      {new Date(b.requested_date).toLocaleDateString("it-IT")}
                    </span>
                    <span className="font-semibold text-ws-text">
                      {formatEur(b.supplier_payout_cents ?? 0)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <SupplierDocumentsManager />
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
      className={`rounded-2xl p-5 border ${highlight ? "bg-ws-yellow border-ws-yellow text-ws-dark" : "bg-white border-gray-100"} shadow-ws-card`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlight ? "text-ws-dark/70" : "text-ws-text-light"}`}
      >
        {label}
      </p>
      <p
        className={`font-display text-3xl font-bold ${highlight ? "text-ws-dark" : "text-ws-blue"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SupplierStatusBanner({ supplier }: { supplier: Supplier }) {
  const trialEnds = new Date(supplier.trial_ends_at);
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  if (supplier.status === "in_attesa") {
    return (
      <div className="bg-ws-yellow/15 border border-ws-yellow/30 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <Clock size={20} className="text-ws-yellow-dark flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-ws-dark">Candidatura in revisione</p>
          <p className="text-sm text-ws-text">
            Stiamo verificando i dati della tua attività. Ti contatteremo entro 48 ore. Nel frattempo
            puoi creare esperienze in bozza.
          </p>
        </div>
      </div>
    );
  }
  if (supplier.status === "sospeso") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <AlertCircle size={20} className="text-ws-red flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-ws-red">Account sospeso</p>
          <p className="text-sm text-ws-text">
            {supplier.status_notes ?? "Contatta info@wondersun.it per maggiori informazioni."}
          </p>
        </div>
      </div>
    );
  }
  if (supplier.subscription_status === "trial") {
    return (
      <div className="bg-ws-blue-pale border border-ws-blue/15 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-ws-blue flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-ws-dark">
            Periodo di prova: {daysLeft} {daysLeft === 1 ? "giorno" : "giorni"} rimanenti
          </p>
          <p className="text-sm text-ws-text">
            Trial termina il {trialEnds.toLocaleDateString("it-IT")}. Dopo verranno addebitati €29
            al mese.
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function ExperienceStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pubblicata: "ws-badge-green",
    bozza: "ws-badge-yellow",
    sospesa: "ws-badge-red",
  };
  return <span className={`ws-badge ${map[status] ?? "ws-badge-blue"} text-[0.6rem]`}>{status}</span>;
}

function BookingStatusPill({ status }: { status: string }) {
  const icons: Record<string, JSX.Element> = {
    richiesta: <Clock size={11} className="text-ws-yellow-dark" />,
    confermata: <CheckCircle2 size={11} className="text-green-600" />,
    pagata: <CheckCircle2 size={11} className="text-green-600" />,
    rifiutata: <XCircle size={11} className="text-ws-red" />,
    annullata: <XCircle size={11} className="text-ws-red" />,
  };
  return (
    <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-ws-text">
      {icons[status]}
      {status}
    </span>
  );
}
