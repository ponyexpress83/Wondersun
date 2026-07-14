import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalDoc from "@/components/LegalDoc";
import { COOKIE_DOC } from "@/lib/legal-content";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = { title: "Cookie Policy" };

export default async function CookiePage() {
  const profile = await getCurrentProfile();
  return (
    <>
      <Navbar profile={profile} />
      <main className="pt-24 pb-20 bg-gradient-to-b from-ws-blue-pale/40 to-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDoc blocks={COOKIE_DOC} />
        </div>
      </main>
      <Footer />
    </>
  );
}
