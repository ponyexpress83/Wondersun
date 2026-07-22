import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { getI18n } from "@/lib/i18n.server";

const AREAS = [
  { name: "Argentario", image: "https://images.unsplash.com/photo-1533514114760-4389f572ad05?w=800&q=80", count: 18 },
  { name: "Manciano", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80", count: 12 },
  { name: "Sorano", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", count: 14 },
  { name: "Arcille", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", count: 9 },
];

export default function TerritorySection() {
  const t = getI18n().dict.terr;

  return (
    <section id="territorio" className="py-24 bg-ws-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="ws-badge ws-badge-blue mb-4">{t.badge}</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            {t.titleLead} <span className="text-ws-blue italic">{t.titleEm}</span>
          </h2>
          <div className="ws-section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AREAS.map((area) => (
            <Link
              key={area.name}
              href={`/esperienze?area=${encodeURIComponent(area.name)}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-ws-card hover:shadow-ws-card-hover transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={area.image}
                alt={area.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-2 text-ws-yellow text-xs font-semibold tracking-widest uppercase">
                  <MapPin size={13} />
                  {area.count} {t.count}
                </div>
                <h3 className="font-display text-3xl font-bold mb-2">{area.name}</h3>
                <p className="text-sm text-white/80 leading-snug mb-3">{t.areas[area.name]}</p>
                <span className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                  {t.explore}
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
