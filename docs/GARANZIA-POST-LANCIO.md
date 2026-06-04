# Garanzia post-consegna · 60 giorni

> Riferimento contrattuale: **Art. 7** dell'Accordo Completo Wondersun.

## Cosa è coperto

Per i 60 giorni solari successivi alla consegna ufficiale della Piattaforma il
Prestatore garantisce:

- **Bug fixing gratuito** su difetti riconducibili allo sviluppo
- **Risposta** alle segnalazioni del Committente **entro 48 ore lavorative**
- **Rilascio correzioni** necessarie **entro 5 giorni lavorativi** dalla conferma del bug

## Cosa NON è coperto (Art. 7 del contratto)

- Malfunzionamenti causati da modifiche al codice apportate dal Committente o da terzi
- Interruzioni di servizi terzi (Stripe, Netlify, Railway, Supabase, Anthropic, dominio)
- Difetti dovuti a browser/dispositivi non standard
- Nuove funzionalità o modifiche di scope (→ Change Management Art. 8)
- Uso improprio della Piattaforma da parte di Committente, Fornitori o utenti finali
- Attacchi informatici non rilevabili con misure di sicurezza standard
- Conseguenze fiscali o regolatorie del modello operativo scelto dal Committente

## Processo operativo da attivare al go-live

1. **Canale di segnalazione**: definire con la Committente il canale unico per le segnalazioni (es. email a info@smartcontent24.com con prefisso `[Wondersun bug]`). WhatsApp solo per urgenze.
2. **Ticket queue**: ogni segnalazione genera un task tracciabile (Trello dedicato o Linear/Jira). Stato: `nuovo → triaged → in fix → in test → chiuso`.
3. **SLA tracking**:
   - Reminder automatico a 24h dalla segnalazione (per restare entro le 48h di risposta)
   - Reminder a 3 giorni lavorativi per fix entro 5gg lavorativi
4. **Calendario di scadenza**: la garanzia termina **60 giorni solari** dopo la data di consegna ufficiale comunicata via PEC/email (Art. 2 modalità di pagamento Rata 3). Mettere reminder su calendar 7 giorni prima della fine garanzia.
5. **Report mensile** dei bug ricevuti, chiusi, aperti — utile per il Committente come dimostrazione di stabilità e per eventuali contestazioni.

## Dopo i 60 giorni

Qualsiasi intervento tecnico aggiuntivo è oggetto di **separata quotazione**
alle tariffe vigenti del Prestatore al momento della richiesta (Art. 7 ultimo
paragrafo).

Per coperture estese conviene proporre alla Committente un contratto di
manutenzione annuale separato (preventivo a parte).
