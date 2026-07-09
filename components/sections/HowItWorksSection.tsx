import { Search, Heart, Calendar, MessageSquare, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Esplora il catalogo",
    description: "Scopri le esperienze selezionate da Wondersun nella Maremma Toscana.",
  },
  {
    icon: Heart,
    title: "Scegli le tue preferite",
    description: "Salva le esperienze che ami e componi il tuo percorso, una esperienza alla volta.",
  },
  {
    icon: Calendar,
    title: "Invia richiesta",
    description: "Indica data e numero di partecipanti. Il fornitore conferma la disponibilità.",
  },
  {
    icon: MessageSquare,
    title: "Conferma & vivi",
    description:
      "Il fornitore conferma la richiesta. Online paghi solo la quota digitale Wondersun; l'esperienza la saldi a lui sul posto.",
  },
  {
    icon: Sparkles,
    title: "Vivi l'esperienza",
    description: "Ricevi tutti i dettagli via email e goditi la tua avventura maremmana.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="come-funziona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="ws-badge ws-badge-yellow mb-4">Come Funziona</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            Cinque passi verso il tuo <span className="text-ws-blue italic">Local Escape</span>
          </h2>
          <div className="ws-section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center relative">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-2xl bg-ws-blue-pale flex items-center justify-center mb-4">
                    <Icon size={32} className="text-ws-blue" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ws-yellow text-ws-dark font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-ws-dark mb-2">{step.title}</h3>
                <p className="text-sm text-ws-text-light leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
