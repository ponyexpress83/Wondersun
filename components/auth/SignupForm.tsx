"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface Props {
  role: UserRole;
  redirectTo?: string;
}

export default function SignupForm({ role, redirectTo }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
      if (data.session) {
        toast.success("Account creato!");
        router.push(
          redirectTo ?? (role === "fornitore" ? "/fornitore/dashboard" : "/dashboard"),
        );
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore durante la registrazione";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <p className="font-display text-2xl font-bold text-ws-dark mb-2">Controlla la tua email</p>
        <p className="text-sm text-ws-text-light">
          Ti abbiamo inviato un link di conferma a <strong>{email}</strong>. Clicca per attivare
          l&apos;account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-ws-red">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="ws-label">
          Nome e cognome
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="ws-input"
          autoComplete="name"
        />
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="ws-input"
          autoComplete="new-password"
        />
        <p className="text-xs text-ws-text-light mt-1">Minimo 8 caratteri</p>
      </div>

      <button type="submit" disabled={submitting} className="ws-btn-primary w-full">
        <UserPlus size={15} />
        {submitting ? "Creazione…" : role === "fornitore" ? "Crea account fornitore" : "Crea il mio account"}
      </button>
    </form>
  );
}
