# Roadmap Sprint Wondersun

Riferimento contratto: Allegato B — Piano di Progetto (6 sprint settimanali).
Stato aggiornato: maggio 2026.

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
