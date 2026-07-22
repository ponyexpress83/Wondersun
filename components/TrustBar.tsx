import { ShieldCheck, BadgeCheck, Headphones, CalendarCheck } from "lucide-react";

const ITEMS = [
  { Icon: ShieldCheck, color: "bg-ws-blue", title: "Esperienze selezionate", sub: "Solo il meglio per te" },
  { Icon: BadgeCheck, color: "bg-ws-yellow-dark", title: "Prenotazione sicura", sub: "Paga in modo semplice e protetto" },
  { Icon: Headphones, color: "bg-ws-red", title: "Supporto dedicato", sub: "Siamo qui per aiutarti" },
  { Icon: CalendarCheck, color: "bg-ws-blue-light", title: "Cancellazione flessibile", sub: "Fino a 48h prima dell'esperienza" },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 rounded-3xl bg-white p-6 sm:p-8 shadow-[0_16px_50px_rgba(30,90,168,0.1)] border border-gray-100">
      {ITEMS.map(({ Icon, color, title, sub }) => (
        <div key={title} className="flex items-center gap-3">
          <div className={`w-12 h-12 flex-shrink-0 rounded-full ${color} text-white flex items-center justify-center shadow-md`}>
            <Icon size={22} />
          </div>
          <div>
            <p className="font-display font-extrabold text-ws-blue-dark leading-tight">{title}</p>
            <p className="text-sm text-ws-text-light leading-snug">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
