"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ComponentType } from "react";
import {
  LayoutGrid,
  Waves,
  Landmark,
  UtensilsCrossed,
  Wine,
  Bike,
  Mountain,
  Flower2,
  RotateCcw,
  type LucideProps,
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";

const META: Record<string, { Icon: ComponentType<LucideProps>; color: string }> = {
  "Mare & Costa": { Icon: Waves, color: "#2B7DD4" },
  "Natura & Avventura": { Icon: Mountain, color: "#2B7DD4" },
  Enogastronomia: { Icon: UtensilsCrossed, color: "#F2B41F" },
  "Vino & Degustazioni": { Icon: Wine, color: "#F2B41F" },
  "Sport & Avventura": { Icon: Bike, color: "#2B7DD4" },
  "Cultura & Arte": { Icon: Landmark, color: "#E53935" },
  Benessere: { Icon: Flower2, color: "#E53935" },
};

export default function CatalogSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";
  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.push(`/esperienze?${next.toString()}`);
  };

  const applyPrice = () => {
    const next = new URLSearchParams(params.toString());
    min ? next.set("minPrice", min) : next.delete("minPrice");
    max ? next.set("maxPrice", max) : next.delete("maxPrice");
    router.push(`/esperienze?${next.toString()}`);
  };

  const reset = () => {
    setMin("");
    setMax("");
    router.push("/esperienze");
  };

  const Row = ({
    label,
    catValue,
    Icon,
    color,
  }: {
    label: string;
    catValue: string;
    Icon: ComponentType<LucideProps>;
    color: string;
  }) => {
    const isActive = active === catValue;
    return (
      <button
        onClick={() => setParam("category", catValue === "all" ? undefined : catValue)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isActive ? "bg-ws-yellow/20 text-ws-blue-dark" : "text-ws-text hover:bg-gray-50"
        }`}
      >
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: catValue === "all" ? "#1E5AA8" : color }}
        >
          <Icon size={16} />
        </span>
        {label}
      </button>
    );
  };

  return (
    <aside className="bg-white rounded-3xl shadow-ws-card border border-gray-100 p-5 lg:sticky lg:top-24">
      <p className="font-display text-lg font-extrabold text-ws-blue-dark mb-4">Filtra per</p>

      <p className="text-xs font-bold uppercase tracking-widest text-ws-text-light mb-2">Categorie</p>
      <div className="space-y-1 mb-6">
        <Row label="Tutte le esperienze" catValue="all" Icon={LayoutGrid} color="#1E5AA8" />
        {CATEGORIES.map((cat) => {
          const m = META[cat] ?? { Icon: LayoutGrid, color: "#1E5AA8" };
          return <Row key={cat} label={cat} catValue={cat} Icon={m.Icon} color={m.color} />;
        })}
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-ws-text-light mb-2">Prezzo (€)</p>
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
      <button onClick={applyPrice} className="ws-btn-ghost w-full justify-center mb-5 text-sm">
        Applica prezzo
      </button>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-ws-blue/20 py-2.5 text-sm font-bold text-ws-blue hover:bg-ws-blue-pale transition-colors"
      >
        <RotateCcw size={15} /> Reimposta filtri
      </button>
    </aside>
  );
}
