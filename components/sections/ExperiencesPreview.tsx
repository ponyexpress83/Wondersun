import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ExperienceCard from "@/components/ExperienceCard";
import { listExperiences } from "@/lib/data/experiences";

export default async function ExperiencesPreview() {
  const experiences = await listExperiences({ limit: 6 });

  return (
    <section id="esperienze" className="py-24 bg-ws-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="ws-badge ws-badge-blue mb-4">Le Nostre Esperienze</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-4">
            Ogni viaggio è <span className="text-ws-blue italic">unico</span>
          </h2>
          <div className="ws-section-divider" />
          <p className="text-lg text-ws-text-light max-w-2xl mx-auto mt-4">
            Selezioniamo le esperienze più autentiche della Maremma, dai migliori artigiani locali.
            Tu scegli, noi organizziamo tutto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/esperienze" className="ws-btn-blue inline-flex">
            Vedi tutte le esperienze
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
