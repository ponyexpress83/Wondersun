"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { AREAS } from "@/lib/types";

export default function CatalogSearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [area, setArea] = useState(params.get("area") ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    if (area) next.set("area", area);
    else next.delete("area");
    router.push(`/esperienze?${next.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl md:rounded-full shadow-[0_12px_40px_rgba(30,90,168,0.12)] border border-gray-100 p-2 flex flex-col md:flex-row items-stretch gap-2"
    >
      <label className="flex flex-1 items-center gap-2.5 px-4 py-2.5">
        <Search size={18} className="text-ws-blue shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cosa vuoi vivere?"
          className="w-full bg-transparent outline-none text-ws-text placeholder:text-ws-text-light"
        />
      </label>

      <span className="hidden md:block w-px bg-gray-100 my-2" />

      <label className="flex flex-1 items-center gap-2.5 px-4 py-2.5">
        <MapPin size={18} className="text-ws-blue shrink-0" />
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full bg-transparent outline-none text-ws-text"
        >
          <option value="">Dove?</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <span className="hidden md:block w-px bg-gray-100 my-2" />

      <label className="flex flex-1 items-center gap-2.5 px-4 py-2.5">
        <Calendar size={18} className="text-ws-blue shrink-0" />
        <input
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          placeholder="Quando?"
          className="w-full bg-transparent outline-none text-ws-text placeholder:text-ws-text-light"
        />
      </label>

      <button type="submit" className="ws-btn-yellow px-8 py-3.5 uppercase text-sm whitespace-nowrap">
        Cerca esperienze
      </button>
    </form>
  );
}
