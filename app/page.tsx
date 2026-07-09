import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ExperiencesPreview from "@/components/sections/ExperiencesPreview";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TerritorySection from "@/components/sections/TerritorySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SupplierCTASection from "@/components/sections/SupplierCTASection";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Nessuno decide la tua vacanza al posto tuo",
  description:
    "Wondersun è la guida digitale per scoprire, scegliere e organizzare esperienze autentiche nella Maremma Toscana. Nessun pacchetto imposto, componi il tuo percorso con Sole, l'assistente AI, disponibile 24h.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main>
        <HeroSection />
        <TerritorySection />
        <ExperiencesPreview />
        <HowItWorksSection />
        <TestimonialsSection />
        <SupplierCTASection />
      </main>
      <Footer />
    </>
  );
}
