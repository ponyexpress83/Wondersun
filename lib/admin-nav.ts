import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  BarChart3,
  Ticket,
  FileText,
  Mail,
  Receipt,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Panoramica", icon: LayoutDashboard },
  { href: "/admin/fornitori", label: "Fornitori", icon: Store },
  { href: "/admin/esperienze", label: "Esperienze", icon: BarChart3 },
  { href: "/admin/prenotazioni", label: "Prenotazioni", icon: Calendar },
  { href: "/admin/utenti", label: "Utenti", icon: Users },
  { href: "/admin/codici-sconto", label: "Codici sconto", icon: Ticket },
  { href: "/admin/contenuti", label: "Contenuti", icon: FileText },
  { href: "/admin/email", label: "Email", icon: Mail },
  { href: "/admin/ricevute", label: "Ricevute", icon: Receipt },
];
