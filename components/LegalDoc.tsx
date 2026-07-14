import type { LegalBlock } from "@/lib/legal-content";

/** Rende un documento legale (blocchi title/h/p/li) forniti dall'avvocato. */
export default function LegalDoc({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="space-y-3.5 text-[0.95rem] leading-relaxed text-ws-text">
      {blocks.map((b, i) => {
        if (b.t === "title") {
          return (
            <h1
              key={i}
              className="font-display text-3xl sm:text-4xl font-extrabold text-ws-blue-dark mb-1"
            >
              {b.text}
            </h1>
          );
        }
        if (b.t === "h") {
          return (
            <h2
              key={i}
              className="font-display text-lg sm:text-xl font-extrabold text-ws-blue-dark mt-8 mb-1"
            >
              {b.text}
            </h2>
          );
        }
        if (b.t === "li") {
          const idx = b.text.indexOf(":");
          const term = idx > 0 && idx < 60 ? b.text.slice(0, idx) : null;
          const rest = term ? b.text.slice(idx + 1) : b.text;
          return (
            <p key={i} className="pl-4 border-l-2 border-ws-yellow/60">
              {term ? (
                <>
                  <strong className="text-ws-blue-dark">{term}:</strong>
                  {rest}
                </>
              ) : (
                b.text
              )}
            </p>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
