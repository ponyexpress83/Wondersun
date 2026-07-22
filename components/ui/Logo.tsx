interface LogoProps {
  className?: string;
}

/**
 * Logo Wondersun — riproduzione vettoriale fedele del logo fornito dalla
 * cliente: lente d'ingrandimento (anello blu navy + manico rosso) con al
 * centro un sole dorato e raggi blu/oro/rossi, area "mare" blu in basso a
 * sinistra. Vettoriale: nitido a ogni dimensione e per il favicon.
 */
export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Wondersun"
    >
      <defs>
        <clipPath id="ws-lens">
          <circle cx="140" cy="100" r="74" />
        </clipPath>
      </defs>

      {/* Manico (rosso), dietro l'anello della lente */}
      <line x1="112" y1="130" x2="96" y2="146" stroke="#163a6b" strokeWidth="30" strokeLinecap="round" />
      <line x1="98" y1="146" x2="50" y2="196" stroke="#b01327" strokeWidth="30" strokeLinecap="round" />

      {/* Interno lente */}
      <circle cx="140" cy="100" r="74" fill="#ffffff" />

      {/* Raggi del sole, ritagliati dentro la lente */}
      <g clipPath="url(#ws-lens)">
        <g transform="translate(140,96)">
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#f6b71e" transform="rotate(-18)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#f6b71e" transform="rotate(3)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#f6b71e" transform="rotate(24)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#2f74c9" transform="rotate(-42)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#5a9be0" transform="rotate(-64)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#b01327" transform="rotate(76)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#b01327" transform="rotate(98)" />
          <path d="M0,-70 L9,-34 L-9,-34 Z" fill="#b01327" transform="rotate(120)" />
          <path d="M0,-72 L19,-34 L-19,-34 Z" fill="#2f74c9" transform="rotate(150)" />
          <path d="M0,-72 L19,-34 L-19,-34 Z" fill="#2f74c9" transform="rotate(175)" />
          <path d="M0,-72 L19,-34 L-19,-34 Z" fill="#5a9be0" transform="rotate(200)" />
          <path d="M0,-72 L19,-34 L-19,-34 Z" fill="#2f74c9" transform="rotate(222)" />
          <path d="M0,-72 L19,-34 L-19,-34 Z" fill="#2f74c9" transform="rotate(245)" />
        </g>
      </g>

      {/* Anello lente */}
      <circle cx="140" cy="100" r="74" fill="none" stroke="#163a6b" strokeWidth="16" />

      {/* Nucleo del sole */}
      <circle cx="140" cy="96" r="32" fill="#f6b71e" />
    </svg>
  );
}
