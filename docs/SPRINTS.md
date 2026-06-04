# Roadmap Sprint Wondersun

Riferimento contratto: Allegato B — Piano di Progetto (6 sprint settimanali).
Stato aggiornato: maggio 2026.

## Aggiornamento call committente (23/05/2026) ✅

Funzionalità richieste nell'ultima call e implementate (anticipano parte degli
Sprint 3–5):

- [x] **Prenotazione a richiesta (esperienze premium)**: flag `requires_request`
  per esperienza. Il cliente invia la richiesta → il fornitore conferma,
  rifiuta (motivo predefinito) o propone una data alternativa → il cliente
  accetta/annulla. Tutto in piattaforma, **niente chat a testo libero** per
  evitare il bypass. API: `PATCH /api/bookings/[id]`.
- [x] **Prezzo "paghi solo quello che vivi"**: il prezzo in vetrina è completo;
  online il cliente paga solo la quota Wondersun (concierge digitale), il saldo
  lo versa al fornitore in loco. Breakdown visibile su scheda e form.
- [x] **Commissione premium a quota FISSA** oltre soglia (€1.000) al posto del
  25% (`computeCommission`, configurabile via env). Quota fissa = placeholder
  da confermare con la committente.
- [x] **Pagamento solo dopo conferma**: `POST /api/bookings/[id]/pay` sbloccato
  solo a prenotazione confermata (seam pronto, provider da scegliere).
- [x] **Annullamento gratuito fino a 48h** prima dell'esperienza (enforce server).
- [x] **Notifiche fornitore via WhatsApp + email** sulla prenotazione in entrata
  (`lib/notify.ts`, degradano a no-op senza chiavi).
- [x] **Canone fornitore in dashboard**: stato, prossimo rinnovo, reminder di
  scadenza, pulsante pagamento (`POST /api/subscription/pay`, provider da scegliere).
- [x] **Chatbot "Sole" (voce + testo)**: widget globale con input vocale
  (Web Speech API) che suggerisce esperienze dal catalogo + FAQ assistenza +
  escalation WhatsApp. Matching deterministico, risposta arricchita da Claude se
  `ANTHROPIC_API_KEY` è presente. API: `POST /api/sole`.

Da definire con la committente / passi successivi:
- Provider di pagamento (Stripe vs PayPal) e attivazione incassi reali + webhook.
- Valore della quota fissa premium.
- WhatsApp: numero mittente e approvazione template Cloud API.
- Calendario disponibilità a slot (oggi la data è proposta nella richiesta).
- Gestione pacchetti multi-esperienza con conferme indipendenti.

## Sprint 1 — Setup tecnico e architettura ✅

- [x] Setup Next.js 14 + TypeScript + Tailwind
- [x] Schema DB completo con RLS (`db/schema.sql`)
- [x] Auth Supabase a 3 ruoli (cliente · fornitore · admin)
- [x] Middleware di protezione route
- [x] Design system Coastal Editorial portato dal v2
- [x] Homepage statica con Hero, sezioni, footer
- [x] Pagine legali (privacy, termini, cookie)

## Sprint 2 — Catalogo e dashboard fornitore ✅

- [x] Pagine pubbliche: homepage, catalogo `/esperienze`, dettaglio `/esperienze/[slug]`
- [x] Filtri per categoria/zona + ricerca testuale debounced
- [x] Onboarding fornitore (signup + form dati attività) `/fornitore/registrati`
- [x] Dashboard fornitore con KPI, banner stato, lista esperienze e prenotazioni
- [x] CRUD esperienze completo (create, update, delete, status bozza/pubblicata)
- [x] Upload immagini di copertina via Supabase Storage
- [x] Calcolo automatico breakdown commissione (25% + fee premium configurabile)
- [x] Form richiesta prenotazione lato cliente
- [ ] Mappa interattiva Mapbox (placeholder presente, integrazione Sprint 2.1)
- [ ] Calendario disponibilità per esperienza (struttura DB pronta, UI Sprint 3)

## Sprint 3 — Pacchetti, dashboard cliente, email (DA FARE)

- [ ] Carrello multi-esperienza (`packages` + `package_items`)
- [ ] Storia prenotazioni cliente con stati
- [ ] Cancellazione/modifica richiesta da cliente e fornitore
- [ ] Email transazionali via Resend (conferma richiesta, conferma fornitore, ecc.)
- [ ] Sistema policy di cancellazione configurabile

## Sprint 4 — Stripe + abbonamento (DA FARE)

- [ ] Stripe Checkout per pagamento prenotazioni confermate
- [ ] Stripe Subscription per canone fornitore (€29/mese, trial 90gg)
- [ ] Webhook gestione conferme/fallimenti
- [ ] Ricevute PDF con causali corrette
- [ ] Schermata informativa qualificante in checkout

## Sprint 5 — Admin completo, chatbot AI, GDPR (DA FARE)

- [ ] Workflow admin: approva/rifiuta/sospendi fornitori
- [ ] Gestione utenti, esperienze, prenotazioni globale
- [ ] Esportazione CSV per commercialista
- [ ] Chatbot AI "Sole" via Anthropic Claude, con voice input e FAQ
- [ ] Cookie banner con consent management
- [ ] Audit log completo

## Sprint 6 — Testing, SEO, lancio (DA FARE)

- [ ] Test end-to-end golden path
- [ ] SEO on-page: meta, sitemap, structured data
- [ ] Setup Google Analytics 4 + Search Console
- [ ] Switch Stripe live
- [ ] Configurazione campagne Ads
- [ ] Formazione 2h + documentazione operativa
- [ ] Deploy produzione su Netlify

## Post-lancio

- 60gg garanzia bug fixing
- 1 mese gestione tecnica Ads gratuita
- 3 pubblicazioni Digital PR su testate locali
