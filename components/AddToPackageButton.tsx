"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";

interface Props {
  experienceId: string;
  isAuthenticated: boolean;
}

export default function AddToPackageButton({ experienceId, isAuthenticated }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-ws-blue text-ws-blue rounded-xl font-bold py-3 hover:bg-ws-blue-pale transition-colors"
      >
        <Plus size={16} /> Aggiungi a un pacchetto
      </Link>
    );
  }

  const add = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Errore");
      setAdded(true);
      toast.success(
        data.alreadyInCart ? "Già nel tuo pacchetto" : "Aggiunta al pacchetto",
        {
          description: `Hai ${data.itemCount} esperienze nel pacchetto.`,
          action: { label: "Vai al pacchetto", onClick: () => router.push("/dashboard/pacchetti") },
        },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={add}
      disabled={busy}
      className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-ws-blue text-ws-blue rounded-xl font-bold py-3 hover:bg-ws-blue-pale transition-colors disabled:opacity-50"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? "Nel pacchetto" : "Aggiungi a un pacchetto"}
    </button>
  );
}
