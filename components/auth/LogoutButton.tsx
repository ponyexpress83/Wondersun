"use client";

import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    toast.success("Logout effettuato");
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout} className="ws-btn-ghost w-full text-ws-red border-gray-200">
      <LogOut size={14} /> Esci
    </button>
  );
}
