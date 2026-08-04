"use client";

import { useState } from "react";

interface LogoProps {
  className?: string;
}

/**
 * Logo Wondersun.
 *
 * Se in `public/` esiste il file ufficiale della committente (`logo.png`) viene
 * usato quello, senza alcuna modifica. Finché il file non c'è si mostra la
 * riproduzione vettoriale qui sotto: lente d'ingrandimento (anello blu navy +
 * manico rosso) con al centro un sole dorato e raggi blu/oro/rossi.
 *
 * Per sostituirlo basta caricare `public/logo.png`: nessuna modifica al codice.
 */
export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  const [officialFailed, setOfficialFailed] = useState(false);

  if (!officialFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Wondersun"
        className={`${className} object-contain`}
        onError={() => setOfficialFailed(true)}
      />
    );
  }

  return <LogoFallback className={className} />;
}

function LogoFallback({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Wondersun"
    >
      <defs>
        <clipPath id="ws-lens">
          <circle cx="283" cy="205" r="123" />
        </clipPath>
      </defs>

      {/* Manico: innesto blu navy sull'anello, poi asta rossa. Sta dietro alla lente. */}
      <line x1="186" y1="302" x2="158" y2="330" stroke="#123c6b" strokeWidth="52" strokeLinecap="round" />
      <line x1="163" y1="325" x2="80" y2="408" stroke="#9c1128" strokeWidth="50" strokeLinecap="round" />

      {/* Interno della lente */}
      <circle cx="283" cy="205" r="123" fill="#ffffff" />

      {/* Sole e raggi, ritagliati dentro la lente */}
      <g clipPath="url(#ws-lens)">
        <g transform="translate(283,205)">
          {/* Il "mare": massa blu piena che occupa il quadrante in basso a
              sinistra, con la fascia chiara in alto e il fondale scuro in basso. */}
          <path d="M0,0 L-139.9,4.9 A140,140 0 0 0 -9.8,139.7 Z" fill="#2a7bc8" />
          <path d="M0,0 L-139.9,4.9 A140,140 0 0 0 -107.2,90 Z" fill="#4a97d8" />
          <path d="M0,0 L-74.2,118.7 A140,140 0 0 0 -9.8,139.7 Z" fill="#14539e" />

          {/* Raggi blu stretti in alto a sinistra */}
          <path d="M-6,-62 L6,-62 L14,-140 L-14,-140 Z" fill="#1f6fc0" transform="rotate(-40)" />
          <path d="M-6,-62 L6,-62 L14,-140 L-14,-140 Z" fill="#1f6fc0" transform="rotate(-62)" />

          {/* Raggi dorati: dalla verticale fino a destra */}
          <path d="M-9,-62 L9,-62 L22,-140 L-22,-140 Z" fill="#fbb616" transform="rotate(-14)" />
          <path d="M-9,-62 L9,-62 L22,-140 L-22,-140 Z" fill="#fbb616" transform="rotate(8)" />
          <path d="M-9,-62 L9,-62 L22,-140 L-22,-140 Z" fill="#fbb616" transform="rotate(31)" />
          <path d="M-9,-62 L9,-62 L22,-140 L-22,-140 Z" fill="#fbb616" transform="rotate(54)" />

          {/* Cunei rossi sul fianco destro */}
          <path d="M-12,-62 L12,-62 L30,-140 L-30,-140 Z" fill="#97102a" transform="rotate(95)" />
          <path d="M-12,-62 L12,-62 L30,-140 L-30,-140 Z" fill="#b01a2e" transform="rotate(119)" />
          <path d="M-12,-62 L12,-62 L30,-140 L-30,-140 Z" fill="#97102a" transform="rotate(143)" />
        </g>
      </g>

      {/* Anello della lente */}
      <circle cx="283" cy="205" r="140" fill="none" stroke="#123c6b" strokeWidth="34" />

      {/* Nucleo del sole */}
      <circle cx="283" cy="205" r="55" fill="#fdb614" />
    </svg>
  );
}
