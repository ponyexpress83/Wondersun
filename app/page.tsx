import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ExperiencesPreview from "@/components/sections/ExperiencesPreview";
import DestinationsSection from "@/components/sections/DestinationsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SupplierCTASection from "@/components/sections/SupplierCTASection";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar profile={profile} />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ExperiencesPreview />
        <DestinationsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <SupplierCTASection />
      </main>
      <Footer />
    </>
  );
}
