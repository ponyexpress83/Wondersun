"use client";

import { Send } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useLocale } from "@/components/LocaleProvider";

/**
 * Anteprima statica del chatbot "Wondersun AI" (Sole) mostrata nell'hero.
 * Cliccando si apre la vera chat Sole (evento globale ascoltato da SoleChat).
 */
export default function SoleHeroCard() {
  const locale = useLocale();
  const en = locale === "en";

  const open = () => window.dispatchEvent(new Event("sole:open"));

  return (
    <button
      onClick={open}
      className="w-full max-w-md ml-auto block text-left rounded-3xl bg-white shadow-[0_24px_70px_rgba(30,90,168,0.22)] border border-gray-100 overflow-hidden transition-transform hover:-translate-y-1"
      aria-label={en ? "Chat with Wondersun AI" : "Chatta con Wondersun AI"}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
        <Logo className="w-10 h-10 flex-shrink-0" />
        <div>
          <p className="font-display font-bold text-ws-blue-dark leading-none">Wondersun AI</p>
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
          </p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-3 bg-ws-blue-pale/30">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-ws-text">
          {en
            ? "Hi! I'm Wondersun AI ☀️ Tell me what you love and I'll suggest the perfect experiences for you around the Argentario."
            : "Ciao! Sono Wondersun AI ☀️ Raccontami cosa ami fare in vacanza e ti suggerirò esperienze perfette per te all'Argentario."}
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-ws-blue text-white px-4 py-3 text-sm">
          {en
            ? "Hi! I love the sea, nature and good food."
            : "Ciao! Mi piace il mare, la natura e il buon cibo."}
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <span className="ws-typing-dot" />
          <span className="ws-typing-dot" />
          <span className="ws-typing-dot" />
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-50">
        <span className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-ws-text-light">
          {en ? "Type a message…" : "Scrivi un messaggio…"}
        </span>
        <span className="w-10 h-10 rounded-full bg-ws-blue flex items-center justify-center text-white">
          <Send size={16} />
        </span>
      </div>
    </button>
  );
}
