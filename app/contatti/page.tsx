import Link from "next/link";
import { Mail, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Contatti",
  description: "Contatta Wondersun — la tua guida digitale per le esperienze della Maremma Toscana.",
};

export default async function ContattiPage() {
  const profile = await getCurrentProfile();

  const cards = [
    {
      Icon: Mail,
      title: "Email",
      value: "wondersun.localescape@gmail.com",
      href: "mailto:wondersun.localescape@gmail.com",
      color: "bg-ws-blue",
    },
    {
      Icon: MessageCircle,
      title: "Telefono / WhatsApp",
      value: "379 378 5317",
      href: "https://wa.me/393793785317",
      color: "bg-ws-yellow-dark",
    },
    {
      Icon: MapPin,
      title: "Dove siamo",
      value: "Via Maestrale 12, Porto Ercole (GR)",
      href: "https://maps.google.com/?q=Via+Maestrale+12+Porto+Ercole",
      color: "bg-ws-red",
    },
  ];

  return (
    <>
      <Navbar profile={profile} />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-ws-blue-pale/60 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-14">
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-ws-blue-dark">
              Parliamone
            </h1>
            <p className="font-script text-3xl text-ws-blue mt-1">siamo qui per aiutarti</p>
            <p className="mt-5 text-ws-text-light max-w-xl mx-auto">
              Hai una domanda su un&apos;esperienza o vuoi proporre la tua attività? Scrivici: ti
              rispondiamo in fretta, con supporto umano.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {cards.map(({ Icon, title, value, href, color }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl shadow-ws-card border border-gray-100 p-7 text-center hover:shadow-ws-card-hover transition-shadow"
              >
                <div className={`w-14 h-14 rounded-full ${color} text-white flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <p className="font-display font-extrabold text-ws-blue-dark mb-1">{title}</p>
                <p className="text-sm text-ws-text-light break-words">{value}</p>
              </a>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm font-semibold text-ws-text-light mb-4">Seguici</p>
            <div className="flex items-center justify-center gap-3">
              {[
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Facebook, href: "https://facebook.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-ws-blue-pale text-ws-blue flex items-center justify-center hover:bg-ws-blue hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/esperienze" className="ws-btn-yellow">
                Scopri le esperienze
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
