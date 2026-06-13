import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  slug: string;
  label: string;
  tagline: string;
  image: string;
  accent: string;
}

const CATEGORIES: Category[] = [
  {
    slug: "Mare & Costa",
    label: "Mare & Costa",
    tagline: "Barca, snorkeling, tramonti",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80&auto=format&fit=crop",
    accent: "from-ws-blue/30 to-ws-blue-dark/85",
  },
  {
    slug: "Enogastronomia",
    label: "Enogastronomia",
    tagline: "Cooking class, mercati, sapori",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop",
    accent: "from-ws-red/30 to-ws-red-dark/85",
  },
  {
    slug: "Vino & Degustazioni",
    label: "Vino & Degustazioni",
    tagline: "Cantine nel tufo, vermentino",
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80&auto=format&fit=crop",
    accent: "from-purple-700/30 to-ws-red-dark/85",
  },
  {
    slug: "Natura & Avventura",
    label: "Natura & Avventura",
    tagline: "Trekking, butteri, terme",
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=900&q=80&auto=format&fit=crop",
    accent: "from-emerald-700/30 to-ws-blue-deeper/85",
  },
  {
    slug: "Cultura & Arte",
    label: "Cultura & Arte",
    tagline: "Borghi, etruschi, Sorano",
    image:
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&q=80&auto=format&fit=crop",
    accent: "from-amber-700/30 to-ws-red-dark/85",
  },
  {
    slug: "Sport & Avventura",
    label: "Sport",
    tagline: "Vela, bici, kayak",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&q=80&auto=format&fit=crop",
    accent: "from-ws-blue/30 to-ws-blue-deeper/85",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="ws-badge ws-badge-yellow mb-3">Esperienze per gusti</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ws-dark mt-3">
              Cosa ti va di <span className="ws-gradient-text italic">vivere</span> oggi?
            </h2>
          </div>
          <Link
            href="/esperienze"
            className="text-sm font-bold text-ws-blue hover:text-ws-blue-dark inline-flex items-center gap-1.5 group"
          >
            Tutte le categorie
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/esperienze?category=${encodeURIComponent(c.slug)}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-ws-card hover:shadow-ws-card-hover transition-all duration-500 hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${c.accent}`} />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-display text-lg font-bold leading-tight drop-shadow">
                  {c.label}
                </p>
                <p className="text-[0.7rem] text-white/85 mt-0.5 line-clamp-1">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
