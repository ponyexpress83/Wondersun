import Link from "next/link";

interface Destination {
  slug: string;
  label: string;
  description: string;
  image: string;
  experiences: number;
}

const DESTINATIONS: Destination[] = [
  {
    slug: "Argentario",
    label: "Argentario",
    description: "Mare cristallino e tramonti dalla Costa d'Argento",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&q=80&auto=format&fit=crop",
    experiences: 18,
  },
  {
    slug: "Sorano",
    label: "Sorano",
    description: "Borghi etruschi scolpiti nel tufo",
    image:
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=80&auto=format&fit=crop",
    experiences: 9,
  },
  {
    slug: "Manciano",
    label: "Manciano",
    description: "Casali, vigneti e cucina maremmana",
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=1200&q=80&auto=format&fit=crop",
    experiences: 12,
  },
  {
    slug: "Pitigliano",
    label: "Pitigliano",
    description: "La piccola Gerusalemme sospesa sul tufo",
    image:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80&auto=format&fit=crop",
    experiences: 7,
  },
];

export default function DestinationsSection() {
  return (
    <section id="la-maremma" className="py-20 bg-ws-ivory relative overflow-hidden">
      <div className="ws-blob ws-blob-sky w-96 h-96 -top-20 -right-20" />
      <div
        className="ws-blob ws-blob-sun w-80 h-80 bottom-0 -left-20"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="ws-badge ws-badge-blue mb-3">Le destinazioni</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ws-dark mt-3 mb-3">
            Quattro anime della <span className="ws-gradient-text italic">Maremma</span>
          </h2>
          <p className="text-ws-text-light max-w-2xl mx-auto">
            Dalla costa selvaggia dell&apos;Argentario ai borghi del tufo nell&apos;entroterra. Ogni zona
            è un mondo a sé, con i suoi artigiani e i suoi sapori.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.slug}
              href={`/esperienze?area=${encodeURIComponent(d.slug)}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-ws-card hover:shadow-ws-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.image}
                alt={d.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ws-blue-deeper via-ws-blue-deeper/40 to-transparent" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-full px-3 py-1">
                <span className="text-[0.7rem] font-bold text-ws-blue">
                  {d.experiences} esperienze
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-3xl font-bold mb-1 drop-shadow">{d.label}</h3>
                <p className="text-sm text-white/90 line-clamp-2">{d.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
