"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ComponentType } from "react";
import {
  LayoutGrid,
  Waves,
  Landmark,
  UtensilsCrossed,
  Mountain,
  Flower2,
  RotateCcw,
  ChevronDown,
  type LucideProps,
} from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/types";

// Icone/colori per i 5 gruppi di categoria del mockup.
const GROUP_META: Record<string, { Icon: ComponentType<LucideProps>; color: string }> = {
  mare: { Icon: Waves, color: "#2B7DD4" },
  cultura: { Icon: Landmark, color: "#E53935" },
  enogastronomia: { Icon: UtensilsCrossed, color: "#F2B41F" },
  natura: { Icon: Mountain, color: "#2B7DD4" },
  benessere: { Icon: Flower2, color: "#E53935" },
};

const DURATIONS = [
  { value: "short", label: "Fino a 2 ore" },
  { value: "half", label: "Mezza giornata (2–4 ore)" },
  { value: "full", label: "Oltre 4 ore" },
];

export default function CatalogSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";
  const activeDur = params.get("dur") ?? "";
  const activeLang = params.get("lingua") ?? "";
  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");
  const [open, setOpen] = useState<Record<string, boolean>>({
    durata: false,
    prezzo: false,
    lingua: false,
  });

  const push = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.push(`/esperienze?${next.toString()}`);
  };

  const setParam = (key: string, value?: string) =>
    push((p) => (value && value !== "all" ? p.set(key, value) : p.delete(key)));

  const applyPrice = () =>
    push((p) => {
      min ? p.set("minPrice", min) : p.delete("minPrice");
      max ? p.set("maxPrice", max) : p.delete("maxPrice");
    });

  const reset = () => {
    setMin("");
    setMax("");
    router.push("/esperienze");
  };

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const Row = ({
    label,
    value,
    Icon,
    color,
  }: {
    label: string;
    value: string;
    Icon: ComponentType<LucideProps>;
    color: string;
  }) => {
    const isActive = active === value;
    return (
      <button
        onClick={() => setParam("category", value === "all" ? undefined : value)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isActive ? "bg-ws-yellow/20 text-ws-blue-dark" : "text-ws-text hover:bg-gray-50"
        }`}
      >
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: value === "all" ? "#1E5AA8" : color }}
        >
          <Icon size={16} />
        </span>
        {label}
      </button>
    );
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-t border-gray-100 pt-4 mb-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ws-text-light"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${open[id] ? "rotate-180" : ""}`}
        />
      </button>
      {open[id] && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <aside className="bg-white rounded-3xl shadow-ws-card border border-gray-100 p-5 lg:sticky lg:top-24">
      <p className="font-display text-lg font-extrabold text-ws-blue-dark mb-4">Filtra per</p>

      <p className="text-xs font-bold uppercase tracking-widest text-ws-text-light mb-2">Categorie</p>
      <div className="space-y-1 mb-2">
        <Row label="Tutte le esperienze" value="all" Icon={LayoutGrid} color="#1E5AA8" />
        {CATEGORY_GROUPS.map((g) => {
          const m = GROUP_META[g.value] ?? { Icon: LayoutGrid, color: "#1E5AA8" };
          return <Row key={g.value} label={g.label} value={g.value} Icon={m.Icon} color={m.color} />;
        })}
      </div>

      <Section id="durata" title="Durata">
        <div className="space-y-1">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setParam("dur", activeDur === d.value ? undefined : d.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDur === d.value ? "bg-ws-blue-pale text-ws-blue-dark" : "text-ws-text hover:bg-gray-50"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Section>

      <Section id="prezzo" title="Prezzo (€)">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min"
            className="ws-input py-2"
          />
          <input
            type="number"
            min={0}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Max"
            className="ws-input py-2"
          />
        </div>
        <button onClick={applyPrice} className="ws-btn-ghost w-full justify-center text-sm">
          Applica prezzo
        </button>
      </Section>

      <Section id="lingua" title="Lingua">
        <div className="space-y-1">
          {["Italiano", "English"].map((lang) => (
            <button
              key={lang}
              onClick={() => setParam("lingua", activeLang === lang ? undefined : lang)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLang === lang ? "bg-ws-blue-pale text-ws-blue-dark" : "text-ws-text hover:bg-gray-50"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </Section>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-ws-blue/20 py-2.5 text-sm font-bold text-ws-blue hover:bg-ws-blue-pale transition-colors mt-2"
      >
        <RotateCcw size={15} /> Reimposta filtri
      </button>
    </aside>
  );
}
