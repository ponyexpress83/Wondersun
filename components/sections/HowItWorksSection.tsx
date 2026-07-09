import { Search, Heart, Calendar, MessageSquare, Sparkles } from "lucide-react";
import { getI18n } from "@/lib/i18n.server";

const ICONS = [Search, Heart, Calendar, MessageSquare, Sparkles];

export default function HowItWorksSection() {
  const t = getI18n().dict.how;

  return (
    <section id="come-funziona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="ws-badge ws-badge-yellow mb-4">{t.badge}</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            {t.titleLead} <span className="text-ws-blue italic">{t.titleEm}</span>
          </h2>
          <div className="ws-section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {t.steps.map((step, idx) => {
            const Icon = ICONS[idx] ?? Sparkles;
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
