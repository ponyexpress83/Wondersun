import Link from "next/link";
import { Clock, Users, Star, MapPin, Zap, ShieldCheck } from "lucide-react";
import { formatEur, type ExperienceWithSupplier } from "@/lib/types";

interface ExperienceCardProps {
  experience: ExperienceWithSupplier;
}

/**
 * Card stile GetYourGuide: immagine grande, badge in alto a sinistra,
 * categoria sotto la foto, info chiave + prezzo prominente.
 */
export default function ExperienceCard({ experience: e }: ExperienceCardProps) {
  const isVetrina = e.is_bookable === false;
  return (
    <Link
      href={`/esperienze/${e.slug}`}
      className="ws-exp-card bg-white rounded-2xl overflow-hidden shadow-ws-card border border-gray-100 group block h-full flex flex-col"
    >
      {/* Image area */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-ws-blue-light via-ws-blue to-ws-blue-deeper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e.cover_image_url ?? "/placeholder-cover.svg"}
          alt={e.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Tag in alto a sinistra */}
        {e.tag && (
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-[0.7rem] font-bold text-white shadow-md backdrop-blur-sm"
            style={{ backgroundColor: e.tag_color }}
          >
            {e.tag}
          </div>
        )}

        {/* Modalità vetrina */}
        {isVetrina && (
          <div className="absolute top-3 right-3 bg-white text-ws-dark rounded-full px-3 py-1 shadow-md">
            <span className="text-[0.7rem] font-bold">Contatto diretto</span>
          </div>
        )}

        {/* Rating in basso a sinistra */}
        {e.rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-md">
            <Star size={11} className="text-ws-yellow fill-ws-yellow" />
            <span className="text-xs font-bold text-ws-dark">
              {Number(e.rating).toFixed(1)}
            </span>
            <span className="text-[0.65rem] text-ws-text-light">({e.reviews_count})</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categoria + zona */}
        <div className="flex items-center justify-between text-[0.7rem] mb-2">
          <span className="font-bold text-ws-blue uppercase tracking-wider">{e.category}</span>
          {e.location_area && (
            <span className="text-ws-text-light flex items-center gap-1">
              <MapPin size={11} />
              {e.location_area}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-bold text-ws-dark mb-2 group-hover:text-ws-blue transition-colors duration-200 leading-tight line-clamp-2">
          {e.title}
        </h3>

        <p className="text-sm text-ws-text-light leading-relaxed mb-3 line-clamp-2 flex-1">
          {e.short_description ?? e.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-ws-text-light mb-3">
          {e.duration_label && (
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {e.duration_label}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users size={11} />
            {e.min_participants}–{e.max_participants} pers.
          </span>
          {!isVetrina && (
            <span className="inline-flex items-center gap-1 text-ws-blue font-semibold">
              <ShieldCheck size={11} />
              Annullo 48h
            </span>
          )}
          {e.requires_request && !isVetrina && (
            <span className="inline-flex items-center gap-1 text-ws-red-dark font-semibold">
              <Zap size={11} />A richiesta
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            {e.price_cents > 0 ? (
              <>
                <span className="text-[0.65rem] text-ws-text-light">da</span>
                <div className="font-display text-2xl font-extrabold text-ws-dark leading-none">
                  {formatEur(e.price_cents)}
                </div>
                <span className="text-[0.65rem] text-ws-text-light">
                  {e.price_type === "pro_capite" ? "a persona" : "a gruppo"}
                </span>
              </>
            ) : (
              <div className="text-sm font-bold text-ws-dark">Prezzi dalla struttura</div>
            )}
          </div>
          <span className="text-xs font-bold text-ws-red group-hover:underline">
            {isVetrina ? "Contatta" : "Prenota"} →
          </span>
        </div>
      </div>
    </Link>
  );
}
