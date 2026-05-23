"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

export default function SubscriptionPayButton({ label }: { label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/subscription/pay", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        toast.success("Pagamento avviato");
        router.refresh();
      } else if (data.pending) {
        toast.info(data.error ?? "Pagamento canone in attivazione");
      } else {
        throw new Error(data.error ?? "Errore");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={pay} disabled={busy} className="ws-btn-primary w-full">
      <CreditCard size={15} />
      {busy ? "Attendere…" : label}
    </button>
  );
}
