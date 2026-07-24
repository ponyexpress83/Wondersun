import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import CardImage from "@/components/CardImage";
import type { ExperienceWithSupplier } from "@/lib/types";

interface ExperienceCardProps {
  experience: ExperienceWithSupplier;
}

/** Badge categoria colorato (label + colore) coerente col nuovo design. */
function categoryBadge(category: string): { label: string; bg: string; text: string } {
  const c = category.toLowerCase();
  if (c.includes("mare")) return { label: "MARE", bg: "#2B7DD4", text: "#fff" };
  if (c.includes("cultura") || c.includes("arte")) return { label: "CULTURA", bg: "#E53935", text: "#fff" };
  if (c.includes("vino") || c.includes("enogastr") || c.includes("gastr"))
    return { label: "ENOGASTRONOMIA", bg: "#F2B41F", text: "#0b1f42" };
  if (c.includes("benessere") || c.includes("relax")) return { label: "BENESSERE", bg: "#E53935", text: "#fff" };
  if (c.includes("natura") || c.includes("sport") || c.includes("avventura"))
    return { label: "NATURA", bg: "#2B7DD4", text: "#fff" };
  return { label: category.toUpperCase(), bg: "#1E5AA8", text: "#fff" };
}

export default function ExperienceCard({ experience: e }: ExperienceCardProps) {
  const badge = categoryBadge(e.category);
  const euros = Math.round(e.price_cents / 100);

  return (
    <Link
      href={`/esperienze/${e.slug}`}
      className="ws-exp-card group block bg-white rounded-3xl overflow-hidden shadow-ws-card border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <CardImage
          src={e.cover_image_url}
          alt={e.title}
          category={e.category}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wide shadow-sm"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
        <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-ws-blue-dark shadow-sm transition-colors group-hover:text-ws-red">
          <Heart size={17} />
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-extrabold text-ws-blue-dark leading-snug mb-2 line-clamp-2">
          {e.title}
        </h3>
        <p className="text-sm text-ws-text-light leading-relaxed mb-5 line-clamp-2">
          {e.short_description ?? e.description}
        </p>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-ws-text-light">
            <Clock size={15} />
            <span className="text-sm font-semibold">{e.duration_label}</span>
          </div>
          <div className="text-right leading-none">
            <span className="font-display text-2xl font-extrabold text-ws-red">€ {euros}</span>
            <p className="text-xs text-ws-text-light mt-1">
              {e.price_type === "pro_capite" ? "a persona" : "a gruppo"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
