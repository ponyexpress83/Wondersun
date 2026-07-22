"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sun,
  Send,
  Mic,
  MicOff,
  X,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Info,
} from "lucide-react";
import { formatEur } from "@/lib/types";

interface Suggestion {
  slug: string;
  title: string;
  category: string;
  location_area: string | null;
  price_cents: number;
  cover_image_url: string | null;
  requires_request: boolean;
  supplier?: string | null;
}

interface Message {
  role: "user" | "sole";
  text: string;
  suggestions?: Suggestion[];
}

const WELCOME: Message = {
  role: "sole",
  text: "Ciao! Sono Wondersun AI ☀️ Raccontami cosa ami fare in vacanza e ti suggerirò esperienze perfette per te all'Argentario. Puoi anche parlarmi a voce con il microfono.",
};

const QUICK = [
  "Barca al tramonto",
  "Snorkeling nelle calette",
  "Relax e benessere",
  "Degustazione vini",
];

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
  const showQuick = messages.length === 1; // solo il messaggio di benvenuto

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
  }, [messages, open, sending]);

  // Apertura da trigger esterni (es. card AI nell'hero)
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("sole:open", openHandler);
    return () => window.removeEventListener("sole:open", openHandler);
  }, []);

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

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
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
      {/* Launcher · sole 3D */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Apri la chat con Wondersun AI"
        className={`fixed bottom-6 right-6 z-[60] w-[68px] h-[68px] rounded-full flex items-center justify-center text-ws-blue-deeper ${
          open ? "bg-ws-blue" : "ws-sun-btn"
        }`}
      >
        {open ? (
          <X size={26} className="text-white" />
        ) : (
          <>
            <Sun size={30} strokeWidth={2.2} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-ws-red text-white text-xs font-extrabold grid place-items-center border-2 border-white shadow">
              1
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-[104px] right-6 z-[60] w-[min(92vw,390px)] h-[min(75vh,620px)] bg-white rounded-[22px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-ws-blue-dark to-ws-blue text-white px-4 py-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-ws-yellow-light to-ws-yellow-dark shadow-inner">
              <Sun size={20} className="text-ws-blue-deeper" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">Wondersun AI</p>
              <p className="text-[0.72rem] text-white/85 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-ws-ivory">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "ml-auto bg-gradient-to-br from-ws-blue to-ws-blue-light text-white rounded-br-md shadow-sm"
                      : "mr-auto bg-white text-ws-text border border-gray-100 rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2.5 space-y-2.5">
                    {m.suggestions.map((s) => (
                      <div
                        key={s.slug}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                      >
                        <Link href={`/esperienze/${s.slug}`} className="flex items-stretch gap-3 p-2.5">
                          {s.cover_image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={s.cover_image_url}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-ws-blue-pale grid place-items-center">
                              <Sun size={22} className="text-ws-blue" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-ws-text leading-snug line-clamp-2">
                              {s.title}
                            </p>
                            <p className="text-[0.7rem] text-ws-text-light mt-0.5 truncate">
                              {s.supplier ? `${s.supplier} · ` : ""}
                              {s.location_area}
                            </p>
                            <p className="text-sm font-bold text-ws-blue mt-1">
                              {formatEur(s.price_cents)}
                            </p>
                          </div>
                        </Link>
                        <Link
                          href={`/esperienze/${s.slug}`}
                          className="flex items-center justify-center gap-1.5 mx-2.5 mb-2.5 rounded-xl bg-gradient-to-r from-ws-red to-ws-red-light text-white text-sm font-bold py-2.5 hover:brightness-105 transition"
                        >
                          Richiedi <ArrowRight size={15} />
                        </Link>
                      </div>
                    ))}
                    {m.suggestions.length > 1 && (
                      <p className="text-[0.7rem] text-ws-text-light px-1 leading-relaxed">
                        Ogni richiesta è singola, verso il suo fornitore — le ritrovi tutte nella tua
                        area personale.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="mr-auto bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="ws-typing-dot" />
                <span className="ws-typing-dot" />
                <span className="ws-typing-dot" />
              </div>
            )}

            {showQuick && !sending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-ws-text hover:border-ws-blue hover:text-ws-blue transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer IA (obbligatorio) */}
          <div className="flex items-start gap-1.5 px-4 py-2 bg-white border-t border-gray-50 text-[0.66rem] leading-tight text-ws-text-light">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            <span>
              Wondersun AI è un assistente basato su intelligenza artificiale — non è una persona
              reale. Ti aiuta a scegliere, non sceglie per te.
            </span>
          </div>

          {/* Escalation WhatsApp */}
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
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  listening
                    ? "bg-ws-red text-white animate-pulse"
                    : "bg-gradient-to-br from-ws-yellow-light to-ws-yellow-dark text-ws-blue-deeper"
                }`}
              >
                {listening ? <MicOff size={17} /> : <Mic size={17} />}
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
              placeholder={listening ? "Sto ascoltando…" : "Scrivi un messaggio…"}
              className="flex-1 resize-none rounded-2xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-ws-blue max-h-24"
            />
            <button
              onClick={() => send()}
              disabled={sending || !input.trim()}
              aria-label="Invia"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-ws-blue to-ws-blue-light text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
