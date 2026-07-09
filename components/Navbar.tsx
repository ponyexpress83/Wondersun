"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User, LogOut, LayoutDashboard, Store } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { getDictionary } from "@/lib/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavbarProps {
  profile?: Profile | null;
  variant?: "transparent" | "solid";
}

export default function Navbar({ profile, variant = "transparent" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (variant === "solid") return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const locale = useLocale();
  const t = getDictionary(locale).nav;

  const navLinks = [
    { label: t.experiences, href: "/esperienze" },
    { label: t.howItWorks, href: "/#come-funziona" },
    { label: t.maremma, href: "/#territorio" },
    { label: t.about, href: "/chi-siamo" },
    { label: t.becomeSupplier, href: "/fornitore/registrati" },
  ];

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    toast.success("Logout effettuato");
    window.location.href = "/";
  };

  const dashboardHref =
    profile?.role === "admin"
      ? "/admin"
      : profile?.role === "fornitore"
        ? "/fornitore/dashboard"
        : "/dashboard";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ws-navbar ${scrolled ? "scrolled" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 drop-shadow-sm flex-shrink-0" />
            <div className="flex flex-col leading-tight">
              <span
                className={`font-display text-xl font-bold tracking-wide transition-colors ${scrolled ? "text-ws-blue" : "text-white"}`}
              >
                WONDERSUN
              </span>
              <span
                className={`font-body text-[0.6rem] font-semibold tracking-widest uppercase transition-colors ${scrolled ? "text-ws-text-light" : "text-white/75"}`}
              >
                Local Escape · Maremma
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:text-ws-yellow ${scrolled ? "text-ws-text" : "text-white/90"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher light={!scrolled} />
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${scrolled ? "border-gray-200 text-ws-text hover:border-ws-blue hover:text-ws-blue" : "border-white/30 text-white hover:border-white hover:bg-white/10"}`}
                >
                  <div className="w-7 h-7 rounded-full bg-ws-blue flex items-center justify-center text-white font-bold text-xs">
                    {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">
                    {profile.full_name?.split(" ")[0] ?? "Utente"}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-ws-text">{profile.full_name}</p>
                      <p className="text-xs text-ws-text-light">{profile.email}</p>
                      <span className="ws-badge ws-badge-blue mt-2 text-[0.6rem]">{profile.role}</span>
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
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all duration-200 ${scrolled ? "border-ws-blue text-ws-blue hover:bg-ws-blue-pale" : "border-white/40 text-white hover:border-white hover:bg-white/10"}`}
              >
                <User size={15} />
                {t.login}
              </Link>
            )}
            <Link href="/esperienze" className="ws-btn-primary text-xs py-2.5 px-5">
              <Search size={14} />
              {t.discover}
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-ws-blue" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold tracking-wide uppercase text-ws-text hover:text-ws-blue py-2 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex justify-center pb-1">
                <LanguageSwitcher />
              </div>
              {profile ? (
                <>
                  <Link href={dashboardHref} className="ws-btn-ghost justify-center">
                    <LayoutDashboard size={15} /> {t.dashboard}
                  </Link>
                  <button onClick={handleLogout} className="ws-btn-ghost justify-center text-ws-red">
                    <LogOut size={15} /> {t.logout}
                  </button>
                </>
              ) : (
                <Link href="/login" className="ws-btn-ghost justify-center">
                  <User size={15} /> {t.login}
                </Link>
              )}
              <Link
                href="/esperienze"
                onClick={() => setMenuOpen(false)}
                className="ws-btn-primary w-full"
              >
                <Search size={15} />
                {t.discover}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
