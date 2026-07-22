import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";
import CatalogSearchBar from "@/components/catalog/CatalogSearchBar";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import TrustBar from "@/components/TrustBar";
import { listExperiences } from "@/lib/data/experiences";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Catalogo Esperienze",
  description:
    "Esplora tutte le esperienze Wondersun nella Maremma Toscana: mare, natura, enogastronomia, cultura, benessere.",
};

interface SearchParams {
  category?: string;
  area?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
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
      <Navbar profile={profile} />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-ws-blue-pale/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ws-blue-dark">
                Catalogo Esperienze
              </h1>
              <p className="text-ws-text-light mt-2 max-w-xl">
                Scopri e prenota le migliori esperienze selezionate per te all&apos;Argentario.
              </p>
            </div>
            <p className="font-script text-3xl sm:text-4xl text-ws-blue leading-none">
              Vivi l&apos;Argentario{" "}
              <span className="underline decoration-ws-yellow decoration-4 underline-offset-4">
                come non l&apos;hai mai visto
              </span>
            </p>
          </header>

          {/* Search bar */}
          <CatalogSearchBar />

          {/* Count + sort */}
          <div className="flex items-center justify-between mt-8 mb-6">
            <p className="text-ws-text-light">
              <span className="font-extrabold text-ws-blue-dark">{experiences.length}</span>{" "}
              esperienze trovate
            </p>
          </div>

          {/* Sidebar + grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CatalogSidebar />
            </div>

            <div className="lg:col-span-3">
              {experiences.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-ws-card text-center py-20">
                  <p className="font-display text-2xl font-bold text-ws-blue-dark mb-2">
                    Nessuna esperienza trovata
                  </p>
                  <p className="text-ws-text-light">Prova a modificare i filtri di ricerca.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {experiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-14">
            <TrustBar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
