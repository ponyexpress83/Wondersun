"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES, AREAS } from "@/lib/types";

interface Props {
  initial: {
    category?: string;
    area?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function CatalogFilters({ initial }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(initial.q ?? "");

  // Debounce sulla ricerca testuale
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      startTransition(() => {
        router.push(`/esperienze?${next.toString()}`);
      });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.push(`/esperienze?${next.toString()}`);
    });
  };

  const activeCategory = initial.category ?? "all";
  const activeArea = initial.area ?? "all";

  const hasActiveFilters = activeCategory !== "all" || activeArea !== "all" || q;

  const clearAll = () => {
    setQ("");
    startTransition(() => router.push("/esperienze"));
  };

  return (
    <div className="bg-white rounded-2xl shadow-ws-card border border-gray-100 p-6">
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ws-text-light" />
          <input
            type="search"
            placeholder="Cerca per nome, descrizione o località…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="ws-input pl-11"
          />
          {pending && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ws-text-light">
              …
            </div>
          )}
        </div>

        <div>
          <p className="ws-label">Categoria</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => setParam("category", undefined)}
              label="Tutte"
            />
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat}
                active={activeCategory === cat}
                onClick={() => setParam("category", cat)}
                label={cat}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="ws-label">Zona</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeArea === "all"}
              onClick={() => setParam("area", undefined)}
              label="Tutte"
            />
            {AREAS.map((area) => (
              <FilterChip
                key={area}
                active={activeArea === area}
                onClick={() => setParam("area", area)}
                label={area}
              />
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="self-start flex items-center gap-1.5 text-xs font-semibold text-ws-red hover:text-ws-red-dark"
          >
            <X size={13} /> Pulisci filtri
          </button>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
        active
          ? "bg-ws-blue text-white border-ws-blue shadow-sm"
          : "bg-white text-ws-text border-gray-200 hover:border-ws-blue hover:text-ws-blue"
      }`}
    >
      {label}
    </button>
  );
}
