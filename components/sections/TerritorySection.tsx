import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { getSiteTexts } from "@/lib/site-texts";

/**
 * Il Territorio — riquadro unico dedicato a tutta la Maremma Toscana.
 *
 * Sostituisce la precedente suddivisione in quattro zone: legare la sezione a un
 * numero fisso di località dava l'idea di un perimetro circoscritto, mentre la
 * piattaforma copre l'intera Maremma e crescerà verso altre aree.
 * Tutti i testi sono modificabili dal pannello admin ("Testi del sito").
 */
export default async function TerritorySection() {
  const texts = await getSiteTexts();

  const paragraphs = [
    texts["terr.p1"],
    texts["terr.p2"],
    texts["terr.p3"],
    texts["terr.p4"],
  ].filter(Boolean);

  return (
    <section id="territorio" className="py-20 bg-ws-ivory relative overflow-hidden">
      <div className="ws-blob ws-blob-sky w-96 h-96 -top-24 -right-24" />
      <div className="ws-blob ws-blob-sun w-80 h-80 bottom-0 -left-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-ws-card border border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maremma.jpg"
            alt="La Maremma Toscana: mare, borghi, terme e vigneti"
            className="h-56 w-full object-cover sm:h-72 lg:h-80"
          />

          <div className="p-6 sm:p-10">
            <div className="text-center">
              <span className="ws-badge ws-badge-blue">{texts["terr.badge"]}</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ws-dark mt-4 leading-tight">
                {texts["terr.titleLead"]}
                <br />
                <span className="text-ws-blue italic">{texts["terr.titleEm"]}</span>
              </h2>
              <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-ws-blue to-ws-yellow" />
            </div>

            <div className="mt-8 space-y-5 leading-relaxed text-ws-text">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[0.98rem]">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-9 border-t border-gray-100 pt-7 text-center">
              <p className="flex items-center justify-center gap-2 font-display text-lg font-bold text-ws-blue-dark">
                <Heart size={18} className="text-ws-yellow-dark" />
                {texts["terr.ctaTitle"]}
              </p>
              <p className="mb-5 mt-1 text-sm text-ws-text-light">{texts["terr.ctaSubtitle"]}</p>
              <Link href="/esperienze" className="ws-btn-yellow text-sm uppercase px-8 py-4">
                {texts["terr.ctaButton"]}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
