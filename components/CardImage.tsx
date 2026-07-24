"use client";

import { useState } from "react";

/** Cover illustrata self-hosted per categoria, usata come fallback se la foto
 *  dell'esperienza non è disponibile o non carica. */
export function coverForCategory(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("mare") || c.includes("costa")) return "/covers/mare.svg";
  if (c.includes("cultura") || c.includes("arte")) return "/covers/cultura.svg";
  if (c.includes("vino") || c.includes("enogastr") || c.includes("gastr"))
    return "/covers/enogastronomia.svg";
  if (c.includes("benessere") || c.includes("relax")) return "/covers/benessere.svg";
  return "/covers/natura.svg"; // natura / sport / avventura / default
}

export default function CardImage({
  src,
  alt,
  category,
  className,
}: {
  src?: string | null;
  alt: string;
  category: string;
  className?: string;
}) {
  const fallback = coverForCategory(category);
  const [current, setCurrent] = useState(src || fallback);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
