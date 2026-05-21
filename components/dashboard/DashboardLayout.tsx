import Link from "next/link";
import Logo from "@/components/ui/Logo";
import LogoutButton from "@/components/auth/LogoutButton";
import type { Profile } from "@/lib/types";

import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  profile: Profile;
  nav: NavItem[];
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ profile, nav, title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-ws-ivory flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <Logo className="w-8 h-8" />
          <div>
            <p className="font-display text-base font-bold text-ws-blue leading-none">WONDERSUN</p>
            <p className="text-[0.55rem] tracking-widest uppercase text-ws-text-light">
              {profile.role === "admin"
                ? "Admin"
                : profile.role === "fornitore"
                  ? "Area Fornitore"
                  : "Area Personale"}
            </p>
          </div>
        </Link>

        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="ws-sidebar-item">
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-ws-blue flex items-center justify-center text-white font-bold text-sm">
              {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ws-text truncate">{profile.full_name}</p>
              <p className="text-xs text-ws-text-light truncate">{profile.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 lg:px-10 py-6">
          <h1 className="font-display text-3xl font-bold text-ws-dark">{title}</h1>
          {subtitle && <p className="text-sm text-ws-text-light mt-1">{subtitle}</p>}
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
