"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import type { DemoRole } from "@/lib/demo";

interface Props {
  role: DemoRole;
  label: string;
}

export default function DemoLoginButton({ role, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Accesso demo non riuscito");
      toast.success(`Accesso demo come ${role}`);
      router.push(data.redirectTo ?? "/");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore durante l'accesso demo";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className="ws-btn-blue w-full">
      <LogIn size={15} />
      {loading ? "Accesso…" : label}
    </button>
  );
}
