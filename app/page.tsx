import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ExperiencesPreview from "@/components/sections/ExperiencesPreview";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TerritorySection from "@/components/sections/TerritorySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SupplierCTASection from "@/components/sections/SupplierCTASection";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

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
