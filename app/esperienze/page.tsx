import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";
import CatalogFilters from "@/components/CatalogFilters";
import { listExperiences } from "@/lib/data/experiences";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Catalogo Esperienze",
  description:
    "Esplora tutte le esperienze Wondersun nella Maremma Toscana: mare, natura, enogastronomia, cultura.",
};

interface SearchParams {
  category?: string;
  area?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const profile = await getCurrentProfile();
  const experiences = await listExperiences({
    category: searchParams.category,
    area: searchParams.area,
    query: searchParams.q,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  });

  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="pt-24 pb-20 bg-ws-ivory min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-ws-blue mb-2">
              Catalogo Wondersun
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ws-dark mb-3">
              Le esperienze della Maremma
            </h1>
            <p className="text-ws-text-light max-w-2xl">
              {experiences.length} esperienze disponibili. Filtra per categoria, zona e prezzo per
              trovare quella perfetta per te.
            </p>
          </header>

          <CatalogFilters initial={searchParams} />

          {experiences.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ws-text mb-2">Nessuna esperienza trovata</p>
              <p className="text-ws-text-light">Prova a modificare i filtri di ricerca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
