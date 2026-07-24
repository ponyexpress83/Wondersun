"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "popular", label: "Più popolari" },
  { value: "price_asc", label: "Prezzo crescente" },
  { value: "price_desc", label: "Prezzo decrescente" },
];

export default function CatalogSort() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "popular";

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "popular") next.set("sort", value);
    else next.delete("sort");
    router.push(`/esperienze?${next.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm text-ws-text-light">
      <span className="hidden sm:inline">Ordina per:</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-semibold text-ws-blue-dark focus:outline-none focus:ring-2 focus:ring-ws-blue/30"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
