import Link from "next/link";
import { Clock, Users, Star, MapPin, ArrowRight } from "lucide-react";
import { formatEur, type ExperienceWithSupplier } from "@/lib/types";

interface ExperienceCardProps {
  experience: ExperienceWithSupplier;
}

export default function ExperienceCard({ experience: e }: ExperienceCardProps) {
  return (
    <Link
      href={`/esperienze/${e.slug}`}
      className="ws-exp-card bg-white rounded-2xl overflow-hidden shadow-ws-card border border-gray-100 group block"
    >
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e.cover_image_url ?? "/placeholder-cover.jpg"}
          alt={e.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {e.tag && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: e.tag_color }}
          >
            {e.tag}
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-ws-blue">{e.category}</span>
        </div>
        {e.is_bookable === false && (
          <div className="absolute bottom-4 right-4 bg-ws-dark/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-semibold text-white">Contatto diretto</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-ws-text-light">
            <MapPin size={11} />
            <span className="text-xs">{e.location_name}</span>
          </div>
          {e.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-ws-yellow fill-ws-yellow" />
              <span className="text-sm font-bold text-ws-text">{Number(e.rating).toFixed(1)}</span>
              <span className="text-xs text-ws-text-light">({e.reviews_count})</span>
            </div>
          )}
        </div>

        <h3 className="font-display text-xl font-bold text-ws-dark mb-2 group-hover:text-ws-blue transition-colors duration-200">
          {e.title}
        </h3>
        <p className="text-sm text-ws-text-light leading-relaxed mb-4 line-clamp-2">
          {e.short_description ?? e.description}
        </p>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
          {e.duration_label && (
            <div className="flex items-center gap-1.5 text-ws-text-light">
              <Clock size={12} />
              <span className="text-xs">{e.duration_label}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-ws-text-light">
            <Users size={12} />
            <span className="text-xs">
              {e.min_participants}–{e.max_participants} persone
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {e.price_cents > 0 ? (
              <>
                <div className="font-display text-2xl font-bold text-ws-blue">
                  {formatEur(e.price_cents)}
                </div>
                <span className="text-xs text-ws-text-light">
                  {e.price_type === "pro_capite" ? "a persona" : "a gruppo"}
                </span>
              </>
            ) : (
              <span className="text-xs text-ws-text-light">Prezzi dalla struttura</span>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-sm font-bold text-ws-red group-hover:gap-3 transition-all">
            Scopri
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
