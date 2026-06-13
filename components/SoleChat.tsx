"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sun, Send, Mic, MicOff, X, MessageCircle, ExternalLink } from "lucide-react";
import { formatEur } from "@/lib/types";

interface Suggestion {
  slug: string;
  title: string;
  category: string;
  location_area: string | null;
  price_cents: number;
  cover_image_url: string | null;
  requires_request: boolean;
}

interface Message {
  role: "user" | "sole";
  text: string;
  suggestions?: Suggestion[];
}

const WELCOME: Message = {
  role: "sole",
  text: "Ciao! Sono Sole, la concierge di Wondersun. ☀️ Raccontami che vacanza sogni — mare e barca a vela, una cena di pesce, vino in cantina, i borghi etruschi… — e ti propongo le esperienze giuste. Puoi anche scrivermi a voce con il microfono.",
};

export default function SoleChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;

  // Aperture programmatiche dall'hero (link "chiedi a Sole" nella search bar)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ws-open-sole", handler);
    return () => window.removeEventListener("ws-open-sole", handler);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setVoiceSupported(true);
    const rec = new SR();
    rec.lang = "it-IT";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript as string;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const toggleVoice = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/sole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore");
      setMessages((m) => [
        ...m,
        { role: "sole", text: data.reply, suggestions: data.suggestions },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "sole",
          text: "Mi dispiace, ho avuto un intoppo. Riprova tra poco o contatta l'assistenza.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Apri la chat con Sole"
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-ws-yellow text-ws-dark shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        style={{ boxShadow: "0 8px 28px rgba(255,197,51,0.45)" }}
      >
        {open ? <X size={24} /> : <Sun size={26} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[min(92vw,380px)] h-[min(75vh,560px)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-ws-blue to-ws-blue-dark text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ws-yellow text-ws-dark flex items-center justify-center flex-shrink-0">
              <Sun size={18} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">Sole</p>
              <p className="text-[0.7rem] text-white/80">Concierge Wondersun</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-ws-ivory">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                    m.role === "user"
                      ? "ml-auto bg-ws-blue text-white rounded-br-sm"
                      : "mr-auto bg-white text-ws-text border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.suggestions.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/esperienze/${s.slug}`}
                        className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2 hover:border-ws-blue transition-colors"
                      >
                        {s.cover_image_url && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={s.cover_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-ws-text truncate">{s.title}</p>
                          <p className="text-[0.7rem] text-ws-text-light">
                            {s.location_area} · {formatEur(s.price_cents)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="mr-auto bg-white text-ws-text-light border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
                Sole sta pensando…
              </div>
            )}
          </div>

          {/* Escalation */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold text-ws-blue py-1.5 border-t border-gray-100 hover:bg-ws-blue-pale"
            >
              <MessageCircle size={13} /> Parla con un operatore su WhatsApp
              <ExternalLink size={11} />
            </a>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-2.5 flex items-end gap-2">
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                aria-label={listening ? "Ferma il messaggio vocale" : "Parla con Sole"}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  listening ? "bg-ws-red text-white animate-pulse" : "bg-ws-blue-pale text-ws-blue"
                }`}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={listening ? "Sto ascoltando…" : "Scrivi o parla a Sole…"}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-ws-blue max-h-24"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="Invia"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-ws-blue text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
