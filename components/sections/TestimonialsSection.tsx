import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Laura M.",
    location: "Milano",
    text: "Ho prenotato l'esperienza in barca al tramonto e poi una cena con chef locale. Tutto perfetto, gestione impeccabile. Tornerò sicuramente.",
    rating: 5,
  },
  {
    name: "Marco e Giulia",
    location: "Torino",
    text: "Abbiamo composto la nostra settimana in Maremma esperienza dopo esperienza, come volevamo noi. Wondersun ci ha fatto scoprire posti che da soli non avremmo mai trovato.",
    rating: 5,
  },
  {
    name: "Famiglia Conti",
    location: "Roma",
    text: "L'e-bike tour tra Sorano e Pitigliano è stata l'esperienza più bella delle vacanze. La guida era preparatissima e i ragazzi si sono divertiti tantissimo.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="ws-badge ws-badge-red mb-4">Testimonianze</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            Cosa dicono i nostri <span className="text-ws-blue italic">ospiti</span>
          </h2>
          <div className="ws-section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-ws-ivory rounded-2xl p-8 relative border border-gray-100 shadow-ws-card"
            >
              <div className="absolute -top-4 left-6 text-7xl font-display text-ws-yellow opacity-60">
                &ldquo;
              </div>
              <div className="flex items-center gap-1 mb-4 pt-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-ws-yellow fill-ws-yellow" />
                ))}
              </div>
              <p className="text-ws-text leading-relaxed mb-6 italic">{t.text}</p>
              <div>
                <p className="font-bold text-ws-dark">{t.name}</p>
                <p className="text-xs text-ws-text-light">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
