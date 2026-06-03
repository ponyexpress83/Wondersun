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

  const handleGoogle = async () => {
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo ?? "/dashboard")}` },
      });
      if (error) throw error;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore login Google";
      setError(msg);
      toast.error(msg);
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

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-ws-text hover:bg-gray-50"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.4 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.4 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.2 35 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4 5.6l6.4 5.4c-.5.5 6.8-5 6.8-15 0-1.2-.1-2.4-.4-3.5z" />
        </svg>
        Continua con Google
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-ws-text-light">oppure email e password</span>
        </div>
      </div>

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
