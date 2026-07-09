import { Star } from "lucide-react";
import { getI18n } from "@/lib/i18n.server";

const META = [
  { name: "Laura M.", location: "Milano", rating: 5 },
  { name: "Marco e Giulia", location: "Torino", rating: 5 },
  { name: "Famiglia Conti", location: "Roma", rating: 5 },
];

export default function TestimonialsSection() {
  const t = getI18n().dict.testi;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="ws-badge ws-badge-red mb-4">{t.badge}</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            {t.titleLead} <span className="text-ws-blue italic">{t.titleEm}</span>
          </h2>
          <div className="ws-section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {META.map((m, i) => (
            <div
              key={m.name}
              className="bg-ws-ivory rounded-2xl p-8 relative border border-gray-100 shadow-ws-card"
            >
              <div className="absolute -top-4 left-6 text-7xl font-display text-ws-yellow opacity-60">
                &ldquo;
              </div>
              <div className="flex items-center gap-1 mb-4 pt-2">
                {Array.from({ length: m.rating }).map((_, s) => (
                  <Star key={s} size={16} className="text-ws-yellow fill-ws-yellow" />
                ))}
              </div>
              <p className="text-ws-text leading-relaxed mb-6 italic">{t.items[i]}</p>
              <div>
                <p className="font-bold text-ws-dark">{m.name}</p>
                <p className="text-xs text-ws-text-light">{m.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
