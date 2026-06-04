import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Template email transazionali — Allegato A § 4.3.
 * Le variabili sono `{nomeCliente}`, `{titoloEsperienza}`, `{dataEsperienza}`,
 * `{codicePrenotazione}`, `{linkAccesso}`, `{motivazione}`, ecc. interpolate al send.
 */
export const EMAIL_TEMPLATES = {
  booking_request: {
    title: "Conferma richiesta cliente",
    defaultSubject: "Abbiamo ricevuto la tua richiesta · {codicePrenotazione}",
    defaultBody:
      "Ciao {nomeCliente},\n\nabbiamo inviato la tua richiesta per **{titoloEsperienza}** del {dataEsperienza} al fornitore. Riceverai conferma entro 24 ore.\n\nCodice prenotazione: {codicePrenotazione}\n\nGrazie,\nIl team Wondersun",
  },
  booking_confirmed: {
    title: "Conferma fornitore al cliente",
    defaultSubject: "Prenotazione confermata · {titoloEsperienza}",
    defaultBody:
      "Ciao {nomeCliente},\n\nil fornitore ha confermato la tua richiesta per **{titoloEsperienza}** del {dataEsperienza}.\n\nProcedi al pagamento della quota Wondersun dalla tua area personale.\n\nCodice prenotazione: {codicePrenotazione}",
  },
  reminder_24h: {
    title: "Promemoria 24h prima dell'esperienza",
    defaultSubject: "Domani ti aspetta {titoloEsperienza}!",
    defaultBody:
      "Ciao {nomeCliente},\n\nti ricordiamo che domani vivrai **{titoloEsperienza}** alle {oraEsperienza}.\n\nA presto,\nIl team Wondersun",
  },
  cancellation: {
    title: "Conferma annullamento",
    defaultSubject: "Prenotazione annullata · {codicePrenotazione}",
    defaultBody:
      "Ciao {nomeCliente},\n\nla tua prenotazione **{titoloEsperienza}** del {dataEsperienza} è stata annullata.\n\nSe hai già pagato la quota Wondersun e l'annullamento rispetta i termini di disdetta (48h), il rimborso verrà processato entro 7 giorni lavorativi.",
  },
  supplier_new_booking: {
    title: "Notifica nuova prenotazione al fornitore",
    defaultSubject: "Nuova richiesta · {titoloEsperienza}",
    defaultBody:
      "Nuova richiesta di prenotazione per **{titoloEsperienza}** il {dataEsperienza} da {nomeCliente}.\n\nAccedi alla tua dashboard per confermare o proporre una data alternativa: {linkAccesso}",
  },
} as const;

export type EmailSlug = keyof typeof EMAIL_TEMPLATES;

export async function getEmailTemplate(slug: EmailSlug): Promise<{ subject: string; body_md: string }> {
  const fallback = {
    subject: EMAIL_TEMPLATES[slug].defaultSubject,
    body_md: EMAIL_TEMPLATES[slug].defaultBody,
  };
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.from("email_templates").select("subject,body_md").eq("slug", slug).maybeSingle();
    if (!data) return fallback;
    return { subject: data.subject ?? fallback.subject, body_md: data.body_md ?? fallback.body_md };
  } catch {
    return fallback;
  }
}
