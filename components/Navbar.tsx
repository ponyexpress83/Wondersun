"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, User, LogOut, LayoutDashboard, Store } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { getDictionary } from "@/lib/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavbarProps {
  profile?: Profile | null;
  /** conservato per retrocompatibilità: nel nuovo design l'header è sempre bianco */
  variant?: "transparent" | "solid";
}

export default function Navbar({ profile }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = getDictionary(locale).nav;

  const navLinks = [
    { label: t.home, href: "/" },
    { label: t.experiences, href: "/esperienze" },
    { label: t.howItWorks, href: "/#come-funziona" },
    { label: t.about, href: "/chi-siamo" },
    { label: t.contact, href: "/contatti" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    toast.success(locale === "en" ? "Logged out" : "Logout effettuato");
    window.location.href = "/";
  };

  const dashboardHref =
    profile?.role === "admin"
      ? "/admin"
      : profile?.role === "fornitore"
        ? "/fornitore/dashboard"
        : "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-[0_2px_20px_rgba(30,90,168,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <Logo className="w-11 h-11 drop-shadow-sm" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl font-extrabold tracking-tight text-ws-blue-dark">
                WONDER<span className="text-ws-yellow-dark">SUN</span>
              </span>
              <span className="font-script text-lg leading-none text-ws-red -mt-0.5">
                local escape
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-bold uppercase tracking-wide transition-colors ${
                    active ? "text-ws-red" : "text-ws-blue-dark hover:text-ws-red"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-ws-red" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href={profile ? dashboardHref : "/login"}
              aria-label="Preferiti"
              className="text-ws-blue-dark hover:text-ws-red transition-colors"
            >
              <Heart size={22} />
            </Link>
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-label="Account"
                  className="w-9 h-9 rounded-full bg-ws-blue text-white flex items-center justify-center font-bold"
                >
                  {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-ws-text">{profile.full_name}</p>
                      <p className="text-xs text-ws-text-light">{profile.email}</p>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-ws-text hover:bg-ws-blue-pale hover:text-ws-blue transition-colors"
                    >
                      <LayoutDashboard size={15} /> {t.dashboard}
                    </Link>
                    {profile.role === "cliente" && (
                      <Link
                        href="/fornitore/registrati"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-ws-text hover:bg-ws-blue-pale hover:text-ws-blue transition-colors"
                      >
                        <Store size={15} /> {t.becomeSupplier}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ws-red hover:bg-red-50 transition-colors border-t border-gray-50"
                    >
                      <LogOut size={15} /> {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" aria-label={t.login} className="text-ws-blue-dark hover:text-ws-red transition-colors">
                  <User size={22} />
                </Link>
                <Link href="/registrati" className="ws-btn-accent text-xs py-2.5 px-5 uppercase tracking-wide">
                  {t.loginRegister}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-ws-blue-dark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-bold uppercase tracking-wide py-2.5 border-b border-gray-50 ${
                  isActive(link.href) ? "text-ws-red" : "text-ws-blue-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3">
              <LanguageSwitcher />
              {profile ? (
                <button onClick={handleLogout} className="ws-btn-ghost text-ws-red">
                  <LogOut size={15} /> {t.logout}
                </button>
              ) : (
                <Link href="/registrati" onClick={() => setMenuOpen(false)} className="ws-btn-accent">
                  {t.loginRegister}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
