"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent } from "@/components/CookieBanner";

/**
 * Misurazione e remarketing, caricati SOLO dopo il consenso dell'utente
 * (Cookie Policy + Linee guida Garante 10/06/2021):
 *  - Google Analytics 4 → categoria "statistiche"
 *  - Meta Pixel        → categoria "marketing"
 *
 * Gli identificativi arrivano dalle env NEXT_PUBLIC_GA_ID e
 * NEXT_PUBLIC_META_PIXEL_ID: se non impostati non viene caricato nulla.
 */
export default function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const [stats, setStats] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const read = () => {
      const c = getStoredConsent();
      setStats(Boolean(c?.statistiche));
      setMarketing(Boolean(c?.marketing));
    };
    read();
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { statistiche?: boolean; marketing?: boolean }
        | undefined;
      if (detail) {
        setStats(Boolean(detail.statistiche));
        setMarketing(Boolean(detail.marketing));
      } else {
        read();
      }
    };
    window.addEventListener("ws-consent-change", onChange);
    return () => window.removeEventListener("ws-consent-change", onChange);
  }, []);

  return (
    <>
      {gaId && stats && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ws-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {pixelId && marketing && (
        <Script id="ws-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
