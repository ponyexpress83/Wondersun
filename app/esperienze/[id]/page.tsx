import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Star, MapPin, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingRequestForm from "@/components/BookingRequestForm";
import AddToPackageButton from "@/components/AddToPackageButton";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";
import { formatEur, computeCommission } from "@/lib/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const exp = await getExperienceBySlug(params.id);
  if (!exp) return { title: "Esperienza non trovata" };
  return {
    title: exp.title,
    description: exp.short_description ?? exp.description?.slice(0, 160),
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const exp = await getExperienceBySlug(params.id);
  if (!exp) notFound();

  const profile = await getCurrentProfile();
  const totalSample = exp.price_cents * exp.min_participants;
  const breakdown = computeCommission(totalSample);

  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="pt-24 pb-20 bg-ws-ivory min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/esperienze"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ws-blue hover:text-ws-blue-dark mb-6"
          >
            <ArrowLeft size={15} /> Torna al catalogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            <article>
              <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-ws-card mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exp.cover_image_url ?? "/placeholder-cover.svg"}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
                {exp.tag && (
                  <div
                    className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: exp.tag_color }}
                  >
                    {exp.tag}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="ws-badge ws-badge-blue">{exp.category}</span>
                {exp.location_area && (
                  <span className="ws-badge ws-badge-yellow">{exp.location_area}</span>
                )}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-ws-dark mb-4">
                {exp.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-ws-text-light mb-8">
                {exp.location_name && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={15} className="text-ws-blue" /> {exp.location_name}
                  </span>
                )}
                {exp.duration_label && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock size={15} className="text-ws-blue" /> {exp.duration_label}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm">
                  <Users size={15} className="text-ws-blue" /> {exp.min_participants}–
                  {exp.max_participants} persone
                </span>
                {exp.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Star size={15} className="text-ws-yellow fill-ws-yellow" />
                    <strong>{Number(exp.rating).toFixed(1)}</strong>
                    <span className="text-ws-text-light">({exp.reviews_count} recensioni)</span>
                  </span>
                )}
              </div>

              <section className="bg-white rounded-2xl p-8 border border-gray-100 mb-8 shadow-ws-card">
                <h2 className="font-display text-2xl font-bold text-ws-dark mb-4">
                  Cosa ti aspetta
                </h2>
                <p className="text-ws-text leading-relaxed whitespace-pre-line">
                  {exp.description ?? exp.short_description}
                </p>
              </section>

              {exp.supplier && (
                <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-ws-card">
                  <h2 className="font-display text-2xl font-bold text-ws-dark mb-4">
                    Il Fornitore
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-ws-blue-pale flex items-center justify-center text-ws-blue font-display text-2xl font-bold">
                      {exp.supplier.business_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold text-ws-dark">
                        {exp.supplier.business_name}
                      </p>
                      {exp.supplier.city && (
                        <p className="text-sm text-ws-text-light">{exp.supplier.city}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </article>

            <aside className="lg:sticky lg:top-24 self-start">
              <div className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-4xl font-bold text-ws-blue">
                    {formatEur(exp.price_cents)}
                  </span>
                  <span className="text-sm text-ws-text-light">
                    {exp.price_type === "pro_capite" ? "a persona" : "a gruppo"}
                  </span>
                </div>
                <p className="text-xs text-ws-text-light mb-6">
                  {exp.requires_request
                    ? "Esperienza a richiesta: nessun addebito fino alla conferma del fornitore."
                    : "Richiesta di prenotazione: paghi online solo la quota Wondersun (concierge digitale)."}
                </p>

                <BookingRequestForm
                  experienceId={exp.id}
                  experienceSlug={exp.slug}
                  pricePerUnit={exp.price_cents}
                  minParticipants={exp.min_participants}
                  maxParticipants={exp.max_participants}
                  isAuthenticated={!!profile}
                  requiresRequest={exp.requires_request}
                />

                <AddToPackageButton experienceId={exp.id} isAuthenticated={!!profile} />

                <details className="mt-6 border-t border-gray-100 pt-4">
                  <summary className="text-xs font-semibold text-ws-text-light cursor-pointer flex items-center gap-2">
                    <ShieldCheck size={13} /> Come viene calcolato il prezzo
                  </summary>
                  <div className="mt-3 space-y-2 text-xs text-ws-text-light">
                    <p>Esempio per {exp.min_participants} partecipanti:</p>
                    <div className="bg-ws-ivory rounded-lg p-3 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Prezzo esperienza (al fornitore)</span>
                        <strong className="text-ws-text">{formatEur(totalSample)}</strong>
                      </div>
                      <div className="flex justify-between text-ws-text-light">
                        <span>Quota digitale Wondersun ({breakdown.commission_pct}%) · online</span>
                        <span>{formatEur(breakdown.pay_now_cents)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-1.5">
                        <span className="font-semibold text-ws-text">Totale a carico tuo</span>
                        <strong className="text-ws-text">
                          {formatEur(totalSample + breakdown.pay_now_cents)}
                        </strong>
                      </div>
                    </div>
                    <p className="text-[0.7rem]">
                      Il prezzo dell&apos;esperienza lo paghi direttamente al fornitore. Online versi
                      solo la quota digitale Wondersun (il concierge digitale).
                    </p>
                  </div>
                </details>
              </div>

              <div className="mt-4 bg-ws-blue-pale rounded-2xl p-5 border border-ws-blue/15">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-ws-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-ws-blue-dark">
                    <p className="font-bold mb-1">
                      {exp.requires_request ? "Prenotazione a richiesta" : "Richiesta di prenotazione"}
                    </p>
                    <p className="leading-relaxed">
                      {exp.requires_request
                        ? "Il fornitore conferma data e disponibilità o propone un'alternativa. Paghi la quota digitale Wondersun solo dopo la conferma."
                        : "Confermi subito la data. Online paghi solo la quota digitale Wondersun; il prezzo dell'esperienza lo paghi direttamente al fornitore."}
                    </p>
                    <p className="leading-relaxed mt-2">
                      Annullamento gratuito fino a 48 ore prima dell&apos;esperienza.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
