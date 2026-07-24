"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LogIn, AlertCircle } from "lucide-react";

interface Props {
  redirectTo?: string;
  errorMessage?: string;
}

export default function LoginForm({ redirectTo, errorMessage }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(errorMessage ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Accesso effettuato");
      router.push(redirectTo ?? "/dashboard");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore durante l'accesso";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-ws-red">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="ws-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ws-input"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="ws-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="ws-input"
          autoComplete="current-password"
        />
      </div>

      <button type="submit" disabled={submitting} className="ws-btn-blue w-full">
        <LogIn size={15} />
        {submitting ? "Accesso…" : "Accedi"}
      </button>
    </form>
  );
}
