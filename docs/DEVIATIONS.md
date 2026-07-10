# Deviazioni dal contratto firmato

> Documento tecnico — Maggio 2026

Questo documento traccia le scelte di implementazione che **divergono** dal
contratto sottoscritto tra Ginevra Emanuele (Committente) e Cesarini Ilaria
(Prestatore). Servono come base per una formalizzazione via Change Request
ai sensi dell'Art. 8 (Change Management).

## 1. Modello operativo (Art. 2-bis del contratto)

| Tema | Contratto Art. 2-bis | Implementazione |
| --- | --- | --- |
| Natura del servizio | Servizio digitale di prenotazione | **Marketplace** con commissioni |
| Stripe | Stripe Standard, incasso solo Wondersun | Stripe Standard + split logico Wondersun/Fornitore |
| Commissioni dai fornitori | **NESSUNA** | **25%** standard + fee fissa oltre €1.000 |
| Canone abbonamento fornitori | Non previsto | **€29/mese** con 3 mesi di trial |
| Pagamento servizio turistico | Direttamente al Fornitore sul posto | Tramite piattaforma dopo conferma fornitore |
| Cosa paga il cliente | Solo il servizio digitale | Quota Wondersun + quota Fornitore |
| Causale ricevuta | "Servizio di prenotazione digitale personalizzata" | Causale generica di marketplace |

## 2. Impatto fiscale / regolatorio

L'Art. 13 del contratto stabilisce che l'inquadramento fiscale del modello è
responsabilità esclusiva del Committente. Il passaggio dal modello "servizio
digitale" al modello "marketplace" cambia significativamente la qualificazione
fiscale dell'attività:

- Il Committente percepisce commissioni dai fornitori → potenziale uscita dal
  regime forfettario al superamento delle soglie di ricavi (€85.000) o per
  natura dell'attività.
- Potenziale inquadramento come agenzia di viaggi o intermediario, con obblighi
  diversi (es. iscrizione al ROC, regime IVA speciale ex art. 74-ter DPR
  633/72).
- Esposizione a contestazioni dell'Agenzia delle Entrate o della Camera di
  Commercio sulla qualificazione dell'attività.

**Raccomandazione tecnica**: prima del lancio in produzione si suggerisce di:

1. Sottoporre il modello implementato al commercialista del Committente.
2. Formalizzare un Ordine di Modifica sottoscritto tra le Parti che documenti
   la scelta del modello marketplace e l'eventuale compenso aggiuntivo per
   l'adeguamento tecnico (Art. 8 del contratto).
3. Aggiornare i Termini di Servizio e l'informativa privacy con riferimenti
   coerenti al nuovo modello.
4. Valutare la corretta causale Stripe per le ricevute generate.

## 3. Stack tecnologico (Allegato A §1.1)

| Tema | Contratto | Implementazione |
| --- | --- | --- |
| Frontend | Next.js 14 | ✅ Next.js 14 (App Router) |
| Backend | Node.js + Express o Next.js API Routes | ✅ Next.js API Routes |
| Database | PostgreSQL su Supabase | ✅ PostgreSQL su Supabase |
| Auth | Supabase Auth o equivalente | ✅ Supabase Auth |
| Hosting | Netlify + Railway | ✅ Netlify (frontend), backend serverless via Next.js |

Sullo stack non vi sono deviazioni significative.

## 4. Esclusioni del v2 esistente

Il codice v2 fornito come base utilizzava un altro stack (Vite + React +
Wouter + tRPC + MySQL/Drizzle). Per allinearsi al contratto si è scelta una
riscrittura in Next.js, recuperando:

- Design system Coastal Editorial (palette, tipografia, animazioni)
- Componenti UI principali (Navbar, Footer, Hero, ExperienceCard)
- Logica preferiti/pacchetti (rimappata sul nuovo schema)

Il codice v2 originale è stato accantonato e non più utilizzato.

## 5. Modello definitivo: concierge digitale, no 25% (brief 09/07/2026)

Il brief "portare la demo al 100%" fissa come **vincolo non negoziabile** il
modello **concierge digitale**:

- Wondersun NON è un tour operator e NON vende pacchetti; ogni richiesta è
  singola verso un solo fornitore (art. 33 Cod. Turismo).
- Pagamenti separati: online il Cliente paga **solo la quota digitale Wondersun**;
  l'esperienza la paga **direttamente al Fornitore**. Wondersun non incassa il totale.
- I Fornitori pagano un **abbonamento (€29/mese + attivazione)**, **non** una
  commissione del 25%.

Copy allineato a questo modello in: homepage (sezione fornitori), Termini §3,
onboarding fornitore, pagina abbonamento, dizionari i18n.

> Nota di percorso: in un messaggio precedente era stato indicato il 25% come
> corretto; il brief scritto successivo (fonte di verità) ha chiarito il modello
> a 0%/abbonamento, che è stato reso coerente ovunque.

⚠️ **Ancora da riconciliare (logica, non copy):** `computeCommission` calcola
ancora la quota come 25% del totale con split 75% al fornitore (modello
marketplace). Sotto il modello concierge va ridefinita: il Fornitore incassa il
prezzo pieno dell'esperienza e la "quota digitale Wondersun" pagata online dal
Cliente è un corrispettivo separato (importo da definire con la Committente).
Finché non è deciso l'importo, la scheda esperienza mostra ancora il breakdown
25%/75%. **Serve la decisione sull'importo della quota digitale.**
