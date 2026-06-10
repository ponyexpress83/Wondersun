import { Phone, Mail, Globe, MessageCircle } from "lucide-react";

interface Props {
  businessName: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

/**
 * Recapiti diretti per le schede vetrina (fornitori senza prenotazione
 * diretta · modifica Art. 8 04-05/06/2026). Solo visualizzazione dei
 * recapiti — niente form di contatto, come confermato dalla committente.
 */
export default function SupplierContactCard({ businessName, phone, email, website }: Props) {
  const waNumber = phone?.replace(/[^\d+]/g, "");
  return (
    <div className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-ws-text-light mb-1">
        Contatto diretto
      </p>
      <h3 className="font-display text-2xl font-bold text-ws-dark mb-1">{businessName}</h3>
      <p className="text-sm text-ws-text-light mb-5">
        Questa attività gestisce le richieste direttamente: contattala con il canale che
        preferisci.
      </p>

      <div className="space-y-2.5">
        {phone && (
          <a
            href={`tel:${waNumber}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-ws-blue/40 hover:bg-ws-blue-pale/30 transition-colors"
          >
            <Phone size={18} className="text-ws-blue flex-shrink-0" />
            <span className="text-sm font-semibold text-ws-text">{phone}</span>
          </a>
        )}
        {phone && (
          <a
            href={`https://wa.me/${waNumber?.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-500/40 hover:bg-green-50 transition-colors"
          >
            <MessageCircle size={18} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-ws-text">Scrivi su WhatsApp</span>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-ws-blue/40 hover:bg-ws-blue-pale/30 transition-colors"
          >
            <Mail size={18} className="text-ws-blue flex-shrink-0" />
            <span className="text-sm font-semibold text-ws-text break-all">{email}</span>
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-ws-blue/40 hover:bg-ws-blue-pale/30 transition-colors"
          >
            <Globe size={18} className="text-ws-blue flex-shrink-0" />
            <span className="text-sm font-semibold text-ws-text">Sito ufficiale</span>
          </a>
        )}
      </div>

      <p className="text-[0.7rem] text-ws-text-light mt-4 leading-relaxed">
        La prenotazione e il pagamento avvengono direttamente con la struttura, fuori dalla
        piattaforma Wondersun.
      </p>
    </div>
  );
}
