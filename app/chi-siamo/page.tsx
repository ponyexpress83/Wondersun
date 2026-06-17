import Link from "next/link";
import { Sparkles, MapPin, Zap, Lightbulb, UserCheck, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentProfile } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Chi siamo",
  description:
    "Wondersun è il concierge digitale che connette viaggiatori e realtà locali della Maremma Toscana. Non siamo un'agenzia viaggi.",
};

const VALORI = [
  {
    Icon: Sparkles,
    title: "Autenticità",
    text: "Selezioniamo esperienze che raccontano la vera anima della Maremma.",
  },
  {
    Icon: MapPin,
    title: "Territorio",
    text: "Collaboriamo con realtà locali per valorizzare persone, tradizioni e produzioni del territorio.",
  },
  {
    Icon: Zap,
    title: "Semplicità",
    text: "Vogliamo rendere la scoperta e la prenotazione delle esperienze immediate e accessibili.",
  },
  {
    Icon: Lightbulb,
    title: "Innovazione",
    text: "Utilizziamo strumenti digitali per migliorare l'esperienza di viaggio, senza perdere il contatto umano.",
  },
  {
    Icon: UserCheck,
    title: "Personalizzazione",
    text: "Ogni viaggiatore è diverso: per questo offriamo la possibilità di creare esperienze su misura.",
  },
];

export default async function ChiSiamoPage() {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar profile={profile} variant="solid" />
      <main className="bg-ws-ivory">
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-ws-blue-pale to-ws-ivory">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="ws-badge ws-badge-blue mb-4">Chi siamo</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ws-dark mt-4 mb-5">
              La Maremma, raccontata da chi la <span className="text-ws-blue italic">vive ogni giorno</span>
            </h1>
            <div className="ws-section-divider mx-auto" />
            <p className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white bg-ws-red rounded-full px-4 py-2">
              <ShieldCheck size={16} />
              Non siamo un&apos;agenzia viaggi · siamo un concierge digitale
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-lg leading-relaxed text-ws-text">
            <p>
              Wondersun nasce per rendere semplice la scoperta delle esperienze più autentiche
              della Maremma Toscana.
            </p>
            <p>
              Dopo anni di esperienza diretta nel settore turistico, abbiamo osservato quanto fosse
              difficile per i visitatori trovare attività locali di qualità, organizzare il proprio
              tempo e scoprire le eccellenze del territorio.
            </p>
            <p>
              Molte delle esperienze più belle restano spesso nascoste: piccoli produttori, guide
              locali, artigiani, escursioni e attività uniche che meritano di essere valorizzate.
            </p>
            <p>
              Per questo abbiamo creato Wondersun: una piattaforma digitale che connette viaggiatori
              e realtà locali, trasformando ogni soggiorno in un&apos;esperienza autentica, semplice
              e personalizzata.
            </p>
            <p className="text-ws-blue-dark font-semibold">
              Crediamo in un turismo più umano, consapevole e sostenibile, capace di creare valore
              sia per chi visita il territorio sia per chi lo vive ogni giorno.
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-ws-yellow-dark mb-2">
              Founder &amp; Curatrice delle esperienze
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ws-dark mb-6">
              Ginevra Emanuele
            </h2>
            <div className="space-y-5 text-lg leading-relaxed text-ws-text">
              <p>
                Sono nata e cresciuta in Maremma e da sempre vivo questo territorio con passione e
                curiosità.
              </p>
              <p>
                Dopo il diploma in ragioneria, ho maturato esperienze nel settore turistico,
                nell&apos;accoglienza e nel customer care, lavorando a stretto contatto con
                viaggiatori italiani e internazionali.
              </p>
              <p>
                Negli anni ho approfondito il marketing digitale e la promozione territoriale
                attraverso percorsi formativi dedicati allo sviluppo del turismo locale, alla
                comunicazione online e alla progettazione di modelli di business innovativi.
              </p>
              <p>
                Wondersun nasce dall&apos;unione tra la mia conoscenza della Maremma, la passione per
                le relazioni umane e la convinzione che la tecnologia possa rendere il turismo più
                autentico, semplice e accessibile.
              </p>
              <p>
                Ogni esperienza presente sulla piattaforma viene selezionata con cura per
                valorizzare le persone, le tradizioni e le eccellenze del territorio.
              </p>
            </div>
          </div>
        </section>

        {/* Valori */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="ws-badge ws-badge-blue mb-4">I nostri valori</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-ws-dark mt-4">
                Ciò in cui <span className="text-ws-blue italic">crediamo</span>
              </h2>
              <div className="ws-section-divider mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALORI.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-7 hover:shadow-ws-card-hover transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-ws-blue-pale flex items-center justify-center mb-4">
                    <Icon size={22} className="text-ws-blue" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ws-dark mb-2">{title}</h3>
                  <p className="text-ws-text-light leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-ws-yellow-dark mb-2">
              Un progetto supportato da professionisti
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ws-dark mb-6">
              Una rete di partner specializzati
            </h2>
            <div className="space-y-5 text-lg leading-relaxed text-ws-text">
              <p>
                Wondersun è guidata da Ginevra Emanuele e supportata da una rete di partner
                specializzati.
              </p>
              <p>
                La progettazione, lo sviluppo e la manutenzione della piattaforma sono affidati a
                ProntoSito.net, realtà specializzata nella creazione di soluzioni digitali per le
                imprese.
              </p>
              <p>
                Per raccontare la Maremma attraverso immagini autentiche e coinvolgenti,
                collaboriamo inoltre con professionisti della produzione di contenuti fotografici e
                video, inclusi servizi di ripresa aerea con drone.
              </p>
              <p>
                Questo modello agile ci permette di unire competenze digitali, creatività e profonda
                conoscenza del territorio, garantendo un&apos;esperienza semplice, intuitiva e sempre
                in evoluzione.
              </p>
            </div>
          </div>
        </section>

        {/* Chiusura + CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ws-dark mb-4">
              Non ti proponiamo semplici attività.
            </h2>
            <p className="text-xl text-ws-text-light leading-relaxed mb-8">
              Ti aiutiamo a vivere la Maremma in modo autentico, creando ricordi che durano nel
              tempo.
            </p>
            <Link href="/esperienze" className="ws-btn-primary inline-flex">
              Scopri le esperienze
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
