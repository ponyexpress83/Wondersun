interface LogoProps {
  className?: string;
}

/**
 * Logo Wondersun: lente d'ingrandimento con sole giallo al centro
 * e raggi alternati blu/bianco/rosso (12 raggi a 30° l'uno dall'altro).
 */
export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wondersun"
    >
      <circle cx="42" cy="42" r="36" stroke="#2B7DD4" strokeWidth="7" fill="white" />
      <g transform="translate(42,42)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <path
            key={deg}
            d="M0,-26 L3.5,-13 L-3.5,-13 Z"
            fill={["#2B7DD4", "white", "#B71C1C"][i % 3]}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="11" fill="#FFC533" />
        <circle r="5" fill="#e6a800" />
      </g>
      <path
        d="M14,64 Q22,57 30,64 Q38,71 46,64 Q54,57 62,64 Q70,71 70,64"
        stroke="#2B7DD4"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="68" y1="68" x2="88" y2="88" stroke="#B71C1C" strokeWidth="8.5" strokeLinecap="round" />
    </svg>
  );
}
