/**
 * Wondersun · Notifiche transazionali
 *
 * Canali:
 *  - Email via Resend (RESEND_API_KEY)
 *  - WhatsApp via WhatsApp Cloud API (WHATSAPP_TOKEN + WHATSAPP_PHONE_ID)
 *
 * La committente (call 23/05/2026) ha chiesto la notifica WhatsApp sulla
 * prenotazione in entrata perché i fornitori guardano più WhatsApp che email.
 *
 * Tutti i canali degradano in modo controllato: se le chiavi non sono
 * configurate la funzione logga soltanto e non blocca mai il flusso di
 * prenotazione (best-effort, fire-and-forget).
 */

interface NotifyChannels {
  email?: string | null;
  whatsapp?: string | null;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[notify:email skip] → ${to} · ${subject}`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Wondersun <noreply@wondersun.it>",
        to,
        subject,
        html,
      }),
    });
  } catch (e) {
    console.warn("[notify:email error]", e);
  }
}

async function sendWhatsApp(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    console.info(`[notify:whatsapp skip] → ${to}`);
    return;
  }
  const recipient = to.replace(/[^\d]/g, "");
  try {
    await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: text },
      }),
    });
  } catch (e) {
    console.warn("[notify:whatsapp error]", e);
  }
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wondersun.it";

/** Nuova richiesta/prenotazione → avvisa il fornitore (email + WhatsApp). */
export async function notifySupplierNewBooking(
  channels: NotifyChannels,
  data: {
    bookingCode: string;
    experienceTitle: string;
    requestedDate: string;
    participants: number;
    requiresRequest: boolean;
  },
): Promise<void> {
  const dateStr = new Date(data.requestedDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const verb = data.requiresRequest ? "Nuova richiesta di prenotazione" : "Nuova prenotazione";
  const action = data.requiresRequest
    ? "Accedi alla dashboard per confermare o proporre una data alternativa."
    : "Accedi alla dashboard per vedere i dettagli.";

  const text =
    `${verb} su Wondersun\n\n` +
    `${data.experienceTitle}\n` +
    `Data: ${dateStr} · ${data.participants} pax\n` +
    `Codice: ${data.bookingCode}\n\n` +
    `${action}\n${SITE}/fornitore/prenotazioni`;

  const html =
    `<h2>${verb}</h2>` +
    `<p><strong>${data.experienceTitle}</strong></p>` +
    `<p>Data richiesta: <strong>${dateStr}</strong> · ${data.participants} partecipanti<br/>` +
    `Codice prenotazione: ${data.bookingCode}</p>` +
    `<p>${action}</p>` +
    `<p><a href="${SITE}/fornitore/prenotazioni">Apri la dashboard</a></p>`;

  await Promise.allSettled([
    channels.email ? sendEmail(channels.email, `${verb} · ${data.bookingCode}`, html) : null,
    channels.whatsapp ? sendWhatsApp(channels.whatsapp, text) : null,
  ]);
}

/** Esito moderazione fornitore → avvisa l'operatore (email + WhatsApp). */
export async function notifySupplierStatusChange(
  channels: NotifyChannels,
  data: {
    businessName: string;
    status: "approvato" | "rifiutato" | "sospeso" | "riattivato";
    reason?: string | null;
  },
): Promise<void> {
  const messages: Record<string, { title: string; body: string }> = {
    approvato: {
      title: "Profilo approvato",
      body: "Il tuo profilo è stato approvato: ora puoi pubblicare le tue esperienze e ricevere prenotazioni su Wondersun.",
    },
    riattivato: {
      title: "Profilo riattivato",
      body: "Il tuo profilo è di nuovo attivo: le tue esperienze tornano visibili nel catalogo.",
    },
    rifiutato: {
      title: "Candidatura non approvata",
      body: "Al momento la tua candidatura non è stata approvata.",
    },
    sospeso: {
      title: "Profilo sospeso",
      body: "Il tuo profilo è stato temporaneamente sospeso e le tue esperienze non sono più visibili.",
    },
  };

  const m = messages[data.status];
  if (!m) return;

  const reasonLine = data.reason?.trim() ? `\nMotivo: ${data.reason.trim()}` : "";
  const reasonHtml = data.reason?.trim()
    ? `<p><strong>Motivo:</strong> ${data.reason.trim()}</p>`
    : "";

  const text =
    `${m.title} · Wondersun\n\n${data.businessName}\n${m.body}${reasonLine}\n\n` +
    `${SITE}/fornitore/dashboard`;
  const html =
    `<h2>${m.title}</h2>` +
    `<p><strong>${data.businessName}</strong></p>` +
    `<p>${m.body}</p>` +
    reasonHtml +
    `<p><a href="${SITE}/fornitore/dashboard">Apri la dashboard</a></p>`;

  await Promise.allSettled([
    channels.email ? sendEmail(channels.email, `${m.title} · Wondersun`, html) : null,
    channels.whatsapp ? sendWhatsApp(channels.whatsapp, text) : null,
  ]);
}

/** Cambio stato prenotazione → avvisa il cliente (email + WhatsApp). */
export async function notifyClientBookingUpdate(
  channels: NotifyChannels,
  data: {
    bookingCode: string;
    experienceTitle: string;
    status: string;
    date: string;
  },
): Promise<void> {
  const dateStr = new Date(data.date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const messages: Record<string, { title: string; body: string }> = {
    confermata: {
      title: "Prenotazione confermata",
      body: `Il fornitore ha confermato la tua esperienza per il ${dateStr}. Completa il pagamento della quota Wondersun per finalizzare.`,
    },
    data_alternativa: {
      title: "Data alternativa proposta",
      body: `Il fornitore ha proposto una data alternativa (${dateStr}). Accedi per accettarla o annullare.`,
    },
    rifiutata: {
      title: "Richiesta non disponibile",
      body: `Purtroppo il fornitore non ha disponibilità per la data richiesta. Puoi inviare una nuova richiesta per un'altra data.`,
    },
    pagata: {
      title: "Pagamento ricevuto",
      body: `La tua prenotazione per il ${dateStr} è confermata e pagata. Buona esperienza!`,
    },
  };

  const m = messages[data.status];
  if (!m) return;

  const text =
    `${m.title} · Wondersun\n\n${data.experienceTitle}\n${m.body}\n\n` +
    `Codice: ${data.bookingCode}\n${SITE}/dashboard`;
  const html =
    `<h2>${m.title}</h2>` +
    `<p><strong>${data.experienceTitle}</strong></p>` +
    `<p>${m.body}</p>` +
    `<p>Codice prenotazione: ${data.bookingCode}</p>` +
    `<p><a href="${SITE}/dashboard">Vai alle tue prenotazioni</a></p>`;

  await Promise.allSettled([
    channels.email ? sendEmail(channels.email, `${m.title} · ${data.bookingCode}`, html) : null,
    channels.whatsapp ? sendWhatsApp(channels.whatsapp, text) : null,
  ]);
}
