<!-- Documento interno — DPIA fornita dall'avvocato. NON pubblicare sul sito. -->

## VALUTAZIONE D'IMPATTO SULLA PROTEZIONE DEI DATI (DPIA)

ai sensi dell'art. 35 del Regolamento (UE) 2016/679 Titolare del trattamento: Wondersun di Ginevra Emanuele Via Maestrale n. 12, 58019 Porto Ercole, Monte Argentario (GR) P.IVA 01775230533 — C.F. MNLGVR93E42G088O Email: wondersun.localescape@gmail.com PEC: Ginevraemanuele@postecertifica.it Data di redazione: 13 luglio 2026 Versione: 1.0 — Pre-lancio

1. Premessa e base normativa

1.1 La presente DPIA è condotta in applicazione dell'art. 35 del Regolamento (UE) 2016/679 («GDPR»), che impone al titolare del trattamento di effettuare una valutazione d'impatto sulla protezione dei dati quando un trattamento, in particolare se basato sull'uso di nuove tecnologie, può presentare un rischio elevato per i diritti e le libertà delle persone fisiche. Ai sensi delle Linee guida WP248 rev.01 del Gruppo di Lavoro Articolo 29, fatte proprie dal Comitato Europeo per la Protezione dei Dati (EDPB), il ricorrere di due o più dei nove criteri di rischio elevato rende la DPIA obbligatoria. La Piattaforma Wondersun presenta i seguenti criteri: Criterio WP248 Riscontro Criterio 1 — Valutazione o scoring, profilazione inclusa La Piattaforma effettua profilazione degli Utenti che prestano consenso, elaborando preferenze dichiarate per suggerire esperienze Criterio 5 — Trattamento La Piattaforma è aperta al pubblico e destinata a trattare dati di un numero su larga scala potenzialmente elevato di Utenti su scala nazionale Criterio 8 — innovativo di tecnologie Uso nuove L'assistente «Sole» è un LLM (Anthropic) integrato nella Piattaforma, che elabora richieste in linguaggio naturale e formula suggerimenti personalizzati La presenza di tre criteri su nove rende la DPIA obbligatoria ai sensi dell'art. 35, par. 1, GDPR e del provvedimento del Garante n. 467/2018.

1.2 Metodologia La presente DPIA segue la struttura dell'art. 35, par. 7, GDPR e le raccomandazioni delle Linee guida WP248:

- Sezione 2: descrizione sistematica dei trattamenti, delle finalità e dei flussi di dati
- Sezione 3: valutazione di necessità, proporzionalità, minimizzazione, limitazione della conservazione e
base giuridica di ciascun trattamento

- Sezione 4: analisi dei rischi secondo la formula Rischio = Probabilità × Gravità (scala 1-3)
- Sezione 5: misure di mitigazione per ciascun rischio
- Sezione 6: valutazione del rischio residuo e conclusioni
1.3 Soggetti coinvolti

- Titolare del trattamento: Ginevra Emanuele, titolare dell'impresa individuale Wondersun.
- Referente privacy interno: da designare formalmente
- Responsabili del trattamento:
Ubicazione dati Garanzia trasferimen DPA to Irlanda, UE Nessun dall'area «Legal Da formalizzare tramite PandaDoc (AWS eu-west- 1) trasferiment o extra-UE Responsa bile Supabase Servizio Hosting database, autentica zione, archiviazi one Hosting e Francoforte, Vercel distribuzi UE (Function one Region su applicazi piano Pro) one Stripe Gestione pagamen ti USA Documents» dashboard, del su account intestato al Titolare Consultabile su vercel.com/legal/d pa; la Function Region Francoforte su è impostata sul piano Pro — nessun trasferimento extra- UE Incorporato nello Stripe Services Agreement, accettato con l'attivazione dell'account Incorporato nei Nessun trasferiment o extra-UE DPF certificato — Art. 45 GDPR. Controparte europea: Stripe Payments Europe Limited (Irlanda) DPF Anthropic Assistent e IA «Sole» USA certificato Commercial Terms — Art. 45 of Service, accettato Responsa bile Servizio Ubicazione dati Garanzia trasferimen DPA to GDPR. Dati con l'attivazione non dell'account API utilizzati per training modelli; cancellazion e automatica entro circa 30 giorni Meta Platforms Resend Ilaria Cesarini Notifich e WhatsAp p ai Fornitori Invio e- mail transazio nali Sviluppo, gestione tecnica e manuten zione Piattafor ma USA USA Grosseto, Italia DPF Incorporato nei certificato termini della — Art. 45 WhatsApp Business GDPR Platform DPF certificato — Art. 45 GDPR Nessun trasferiment o extra-UE Consultabile su resend.com/legal/d pa, efficace con la registrazione dell'account Atto di Nomina ex art. 28 GDPR

- Contitolari: nessuno
- DPO: non designato (non ricorrono i presupposti obbligatori ex art. 37 GDPR)
Nota sugli account dei servizi:Alla data di redazione della presente DPIA, gli account dei servizi (Supabase, Vercel, Stripe, Anthropic, Meta, Resend) sono configurati sull'utenza di sviluppo di Ilaria Cesarini, come concordato durante la fase di realizzazione. Prima del lancio saranno trasferiti sull'account intestato al Titolare, con consegna della documentazione DPA. Tale passaggio è tracciato come condizione sospensiva alla Sezione 7.

2. Descrizione sistematica dei trattamenti

2.1 Wondersun è una piattaforma digitale che aggrega e pubblica schede descrittive di esperienze e servizi offerti da operatori terzi indipendenti («Fornitori»), consentendo agli Utenti registrati di consultare informazioni, inviare richieste di prenotazione e fruire di servizi digitali di assistenza. La Piattaforma integra un assistente virtuale basato su IA («Sole») che fornisce suggerimenti orientativi sulle esperienze disponibili. Wondersun opera esclusivamente come fornitore di servizi digitali e gestore della Piattaforma. Non svolge attività di agenzia di viaggio, tour operator, organizzatore di pacchetti turistici o intermediario turistico. Il contratto per il Servizio Prenotato si conclude esclusivamente tra Utente e Fornitore.

2.2 Trattamenti mappati ID Trattamento Interessati Dati personali Base giuridica A B Registrazione e gestione account Utenti Richieste prenotazione di Utenti Pagamento C Corrispettivo Utenti digitale D Assistente «Sole» IA Utenti Nome, cognome, e-mail, telefono (se conferito), credenziali cifrate, data di nascita,

## Art. 6(1)(b) — Contratto

preferenze dichiarate Esperienza selezionata, Fornitore, data, orario, numero partecipanti, note, stato Richiesta

## Art. 6(1)(b) — Contratto

ID transazione, importo, esito. La Piattaforma non raccoglie né conserva dati completi delle carte di pagamento (gestiti da Stripe tramite

## Art. 6(1)(b) — Contratto

tokenizzazione)

## Art. 6(1)(b) — Contratto

Testo delle conversazioni. Se consenso alla profilazione attivo: anche preferenze profilo. In assenza di consenso: solo richiesta testuale (modalità legittimo standard). Il interesse ex art. 6(1)(f) opera esclusivamente per miglioramenti aggregati e anonimi del servizio E Profilazione Utenti Preferenze dichiarate, interazioni con «Sole», consenzienti esperienze visualizzate o prenotate

## Art. 6(1)(a) — Consenso

F Gestione Fornitori Fornitori G Navigazione dati tecnici Visitatori, e Utenti, Fornitori H Gestione Reclami Utenti, Fornitori, terzi Denominazione, titolare/legale rapp., CF, P.IVA, indirizzo, telefono, e-mail, PEC, WhatsApp, contenuti Schede, dati bancari,

## Art. 6(1)(b) — Contratto

documentazione amministrativa IP, identificativi dispositivo/browser, log, dati raccolti mediante cookie Identificativi reclamante, estremi Richiesta, contenuto reclamo, istruttoria, esito documentazione

## Art. 6(1)(f) — Legittimo

interesse (sicurezza); Art. 6(1)(b) per cookie tecnici

## Art. 6(1)(b) — Contratto;

## Art. 6(1)(c) — Obbligo

legale; Art. 6(1)(f) — Legittimo interesse

2.3 I trattamenti D e E sono giuridicamente e logicamente distinti ma operativamente collegati. In assenza di consenso alla profilazione: «Sole» opera in modalità standard: elabora esclusivamente la richiesta testuale dell'Utente, la incrocia con il catalogo Wondersun e restituisce risultati ordinati secondo i parametri oggettivi di ranking (categoria, località, disponibilità, completezza della scheda, coerenza con la ricerca, stagionalità). In questa modalità «Sole» non accede a preferenze salvate, cronologia o altri dati personali dell'Utente. Con consenso alla profilazione: il sistema arricchisce l'elaborazione con i dati della Scheda 5 (preferenze, interazioni pregresse, esperienze visualizzate o prenotate), producendo suggerimenti personalizzati. La separazione delle basi giuridiche, contratto per D, consenso per E, garantisce che l'Utente possa sempre utilizzare «Sole» anche senza profilazione, senza alcuna penalizzazione funzionale. Questa architettura è conforme al principio di minimizzazione e al divieto di condizionare il servizio al consenso (cd. coupling prohibition), in linea con le Linee guida EDPB 5/2020 sul consenso.

2.4 Flussi di dati e trasferimenti extra-UE Responsabile Ubicazione Dati trattati Garanzia Supabase Irlanda, UE Dati A, B, D (testo), E, F, G (log), H Nessun trasferimento Vercel Francoforte, UE Dati G (log), distribuzione applicazione Nessun trasferimento Stripe USA Dati C (riconciliazione pagamenti) DPF — Art. 45 GDPR Anthropic USA attivo) Dati D (testo conversazioni); E (se consenso DPF — Art. 45 GDPR Meta/WhatsApp USA Dati F (notifiche ai Fornitori) DPF — Art. 45 GDPR Resend USA Dati A, B, H (e-mail transazionali) DPF — Art. 45 GDPR Ilaria Cesarini Grosseto, Italia manutenzione Accesso amministrativo a tutti i sistemi per Nessun trasferimento

2.5 Dati particolari e categorie vulnerabili:

- Dati ex art. 9 GDPR: non trattati.
- Dati ex art. 10 GDPR: non trattati.
- Minori: blocco registrazione under-14. Dati di minori solo come partecipanti a esperienze indicati da
maggiorenne; nessuna profilazione.

- 
Soggetti vulnerabili: Utenti in contesto turistico; Fornitori micro-imprese.

3. Valutazione di necessità e proporzionalità

3.1 Trattamento A — Registrazione e gestione account Necessità. I dati anagrafici e di contatto sono indispensabili per identificare l'Utente, gestire il rapporto contrattuale e inviare comunicazioni di servizio. La data di nascita è necessaria per verificare la maggiore età e impedire la registrazione di minori di 14 anni. Le credenziali di accesso sono conservate in forma cifrata (hashing con salt). Minimizzazione. Il numero di telefono è facoltativo. Non sono raccolti dati eccedenti le finalità (es. dati di geolocalizzazione, social media, preferenze non dichiarate). Conservazione. Durata del rapporto contrattuale più 24 mesi dalla cessazione (art. 2946 c.c., termine di prescrizione ordinaria).

3.2 Trattamento B — Richieste di prenotazione Necessità. I dati della Richiesta sono indispensabili per trasmettere la prenotazione al Fornitore e gestire il flusso operativo. Le note sono facoltative e inserite volontariamente dall'Utente. Minimizzazione. Sono trasmessi al Fornitore solo i dati necessari all'esecuzione del Servizio Prenotato: nome, contatto, data, orario, numero partecipanti. I dati di pagamento non sono mai trasmessi al Fornitore. Conservazione. 24 mesi dalla cessazione del rapporto contrattuale.

3.3 Trattamento C — Pagamento Corrispettivo digitale Necessità. Il pagamento è condizione per il perfezionamento del Singolo Contratto di Servizio Digitale. La Piattaforma conserva solo dati di riconciliazione (ID transazione, importo, esito). Minimizzazione. I dati completi della carta di pagamento non transitano né sono conservati sui server Wondersun. Stripe opera tramite tokenizzazione e la Piattaforma è conforme a PCI-DSS via Stripe. Conservazione. 10 anni (art. 2220 c.c., scritture contabili).

3.4 Trattamento D — Assistente IA «Sole» Necessità. L'elaborazione del testo delle richieste è indispensabile per generare suggerimenti. L'accesso ai dati di profilazione avviene solo con il consenso dell'Utente. Anthropic, per contratto (DPA incorporato nei Commercial Terms of Service), non utilizza i dati per addestrare i modelli e cancella automaticamente i dati entro circa 30 giorni. Il trasferimento USA è lecito ai sensi dell'art. 45 GDPR su base DPF. Minimizzazione. «Sole» attinge esclusivamente al catalogo Wondersun. Non accede a fonti esterne, non naviga sul web, non utilizza dati da social media. In assenza di consenso alla profilazione, elabora solo il testo della richiesta. Non sono trattati dati sensibili. Conservazione. 12 mesi dall'ultima interazione (su server Wondersun). Presso Anthropic, i dati sono cancellati automaticamente entro circa 30 giorni.

3.5 Trattamento E — Profilazione Necessità. La profilazione è un servizio aggiuntivo che migliora la pertinenza dei suggerimenti. Non è necessaria per il funzionamento base della Piattaforma. Minimizzazione. Sono utilizzati solo i dati volontariamente conferiti (preferenze, interazioni con «Sole», visualizzazioni e prenotazioni). Sono esclusi: dati sensibili, dati di geolocalizzazione, dati da social media, dati di navigazione esterna, dati di minori. Conservazione. Fino alla revoca del consenso e comunque non oltre 24 mesi dall'ultima interazione. Alla revoca, i dati di profilazione sono cancellati automaticamente. Il consenso è raccolto con checkbox distinta e non preselezionata in fase di registrazione, separata dall'accettazione del Contratto. La revoca è possibile in ogni momento dalla sezione «Preferenze privacy» dell'area riservata. Il mancato consenso non preclude l'accesso alla Piattaforma né l'utilizzo di «Sole» in modalità standard.

3.6 Trattamento F — Gestione Fornitori Necessità. I dati sono indispensabili per la gestione del rapporto contrattuale, la pubblicazione della Scheda, la fatturazione dei canoni e le verifiche precontrattuali (KYBC). La documentazione amministrativa è raccolta nella misura richiesta dall'art. 11 del Contratto Fornitore. Minimizzazione. I dati pubblicati nella Scheda (nome attività, descrizione, contatti) sono quelli strettamente necessari per informare l'Utente. I dati bancari sono utilizzati esclusivamente per la fatturazione. Conservazione. Durata del rapporto più 24 mesi. Dati fiscali: 10 anni (art. 2220 c.c.).

3.7 Trattamento G — Navigazione e dati tecnici Necessità. I log tecnici sono indispensabili per garantire la sicurezza e il funzionamento della Piattaforma. I cookie sono esclusivamente tecnici (autenticazione, sessione, consenso, sicurezza pagamenti Stripe). Minimizzazione. I log sono conservati in forma minimale. Non sono utilizzati cookie di profilazione, analytics o tracciamento. Non sono integrati pixel di terze parti. Conservazione. 12 mesi per i log. Per i cookie si rinvia alla Cookie Policy.

3.8 Trattamento H — Gestione Reclami Necessità. I dati sono trattati per adempiere agli obblighi contrattuali (artt. 17-18 dei Contratti), agli obblighi di legge (esercizio diritti ex artt. 15-22 GDPR, notifica data breach ex artt. 33-34 GDPR) e al legittimo interesse alla prevenzione del contenzioso. Minimizzazione. I dati sono raccolti nella misura necessaria all'istruttoria. La verifica dell'identità del reclamante è condotta prima di dare seguito al reclamo. Conservazione. 5 anni dalla chiusura (termine prescrizione ordinaria); 10 anni per dati contrattuali.

3.9 Valutazioni di legittimo interesse (LIA) Per i trattamenti basati sull'art. 6(1)(f) GDPR sono state condotte valutazioni di bilanciamento (Legitimate Interest Assessment) che hanno accertato:

- 
Sicurezza della Piattaforma (G): l'interesse del Titolare a prevenire accessi abusivi e attacchi informatici prevale sui diritti degli interessati, stante la minimizzazione dei log, il breve periodo di conservazione e le misure di sicurezza adottate.

- Miglioramento del servizio IA (D): l'interesse opera esclusivamente in forma aggregata e anonima, senza
impatto sui diritti individuali.

- Gestione Reclami (H): l'interesse a prevenire il contenzioso e migliorare il servizio è bilanciato dalla
limitazione dei dati trattati e dalle garanzie procedurali.

4. Analisi dei rischi per i diritti e le libertà degli interessati

4.1 Metodologia I rischi sono valutati con la formula R = P × G, dove:

- P (Probabilità): 1 = Bassa (improbabile o molto difficile), 2 = Media (possibile in determinate condizioni),
3 = Alta (probabile o già verificatasi in contesti simili)

- G (Gravità dell'impatto): 1 = Bassa (disagio trascurabile), 2 = Media (disagio significativo, perdita di
controllo sui dati), 3 = Alta (danno materiale o morale rilevante, discriminazione, furto d'identità) Il rischio è classificato: Basso (1-2), Medio (3-4), Alto (6-9). R1 — Accesso non autorizzato ai dati degli Utenti Parametro Valore Descrizione Un soggetto non autorizzato accede ai dati personali degli Utenti conservati su Supabase o in transito Fonti Probabilità Gravità Rischio iniziale Attacco informatico (SQL injection, credential stuffing, phishing), credenziali amministrative compromesse, errore umano, vulnerabilità nei sistemi dei responsabili Bassa (1). Infrastruttura su Supabase con cifratura a riposo e in transito; dati in UE; formazione degli amministratori Alta (3). L'accesso potrebbe coinvolgere dati identificativi, preferenze, cronologia prenotazioni, conversazioni con «Sole» Medio (3) R2 — Divulgazione illecita di dati a un Fornitore errato Parametro Valore I dati di una Richiesta di prenotazione (nome, contatto, data, partecipanti) sono comunicati a un Descrizione Fornitore diverso da quello dell'esperienza selezionata Fonti Errore di sistema nel routing della Richiesta, errore umano nella trasmissione Probabilità Bassa (1). Il sistema associa univocamente la Richiesta alla Scheda del Fornitore selezionato Media (2). Consentirebbe a un terzo di conoscere dati di contatto e spostamenti dell'Utente, con potenziale impatto su riservatezza e sicurezza Basso (2) Gravità Rischio iniziale R3 — Output inappropriati, fuorvianti o discriminatori dell'IA Parametro Valore Descrizione Fonti Probabilità «Sole» genera suggerimenti che riflettono bias (es. di genere, etnici, geografici), allucinazioni (esperienze inesistenti o con informazioni errate) o risultati inappropriati rispetto alla richiesta. Il rischio si accentua quando è attiva la profilazione, perché i bias del modello possono interagire con i dati di preferenze producendo effetti di filter bubble Bias intrinseci del LLM, allucinazioni, errata interpretazione della richiesta, correlazioni spurie con i dati di profilazione Media (2). I LLM sono notoriamente soggetti ad allucinazioni e bias; la limitazione al solo catalogo Wondersun riduce ma non elimina il rischio Parametro Valore Media (2). Può influenzare le scelte dell'Utente, orientarlo verso esperienze non realmente pertinenti, Gravità generare frustrazione o percezione discriminatoria. Non produce effetti giuridici automatici (ogni prenotazione è confermata dal Fornitore e accettata dall'Utente) Rischio iniziale Medio (4) R4 — Profilazione senza valido consenso o eccedente i limiti Parametro Valore Dati di profilazione sono trattati in assenza di consenso valido (es. checkbox preselezionata, consenso Descrizione non granulare, mancata segregazione tecnica tra dati contrattuali e di profilazione) ovvero sono trattate categorie di dati escluse dall'informativa Errore nella configurazione del flusso di consenso, consenso prestato senza piena consapevolezza, dati di profilazione mescolati ai dati contrattuali, utilizzo di dati esclusi (es. dati di minori) Bassa (1). Il consenso è raccolto con checkbox separata e non preselezionata; la profilazione è tecnicamente segregata; il Registro Consensi traccia ogni prestazione e revoca Alta (3). La profilazione non consensuale lede il diritto fondamentale alla protezione dei dati (art. 8 Carta dei Diritti Fondamentali UE) e può rivelare abitudini, preferenze e spostamenti Medio (3) Fonti Probabilità Gravità Rischio iniziale R5 — Indisponibilità dei dati (perdita di disponibilità) Parametro Valore Descrizione Fonti I dati personali diventano temporaneamente o permanentemente inaccessibili per guasto tecnico, attacco ransomware, errore di configurazione, cessazione del servizio da parte di un responsabile Malfunzionamento infrastruttura Supabase o Vercel, attacco informatico, errore umano nella configurazione, revoca accesso API Probabilità Bassa (1). Infrastruttura ridondante su AWS eu-west-1; backup giornalieri Gravità Rischio iniziale Media (2). L'indisponibilità impedisce l'erogazione del servizio; la perdita permanente comporterebbe la cancellazione di account e cronologia Basso (2) R6 — Dati di minori trattati senza adeguata verifica dell'età Parametro Valore Un minore di 14 anni si registra falsamente dichiarando un'età superiore, ovvero un minore partecipa Descrizione a un'esperienza e i suoi dati (nome, età) sono trattati senza le tutele rafforzate richieste dall'art. 8 GDPR e dall'art. 2-quinquies del Codice Privacy Fonti Probabilità Assenza di verifica dell'età robusta (la sola richiesta della data di nascita non impedisce dichiarazioni false); minori inseriti come partecipanti da Utenti maggiorenni Media (2). La richiesta della data di nascita è un filtro debole; in piattaforme aperte al pubblico, le registrazioni di minori con falsa dichiarazione sono un fenomeno noto Alta (3). Il Garante ha reiteratamente sanzionato l'assenza di adeguati sistemi di age verification nei Gravità servizi digitali. Il trattamento di dati di minori senza valida base giuridica integra una violazione dell'art.

## 8 GDPR

Alto (6) Rischio iniziale R7 — Trasferimento illecito di dati verso Paesi terzi Parametro Valore Dati personali sono trasferiti verso Paesi terzi in assenza di una decisione di adeguatezza o di garanzie Descrizione adeguate ex artt. 44-49 GDPR, per modifica unilaterale delle condizioni da parte di un responsabile extra-UE o invalidazione del DPF Revoca o invalidazione della certificazione DPF di uno dei responsabili USA (Stripe, Anthropic, Meta, Resend); modifica unilaterale dei termini di servizio; trasferimento a sub-responsabili non autorizzati Bassa (1). I quattro responsabili USA sono attualmente certificati DPF. La certificazione è monitorabile sul sito ufficiale del Data Privacy Framework (www.dataprivacyframework.gov) Alta (3). Un trasferimento senza base giuridica rende illecito il trattamento e espone tutti i dati trasferiti a un regime di protezione inadeguato Medio (3) Fonti Probabilità Gravità Rischio iniziale R8 — Data breach presso i responsabili del trattamento Parametro Valore Descrizione Fonti Probabilità Una violazione dei dati personali si verifica presso uno dei responsabili (Supabase, Stripe, Anthropic, Meta, Resend, Vercel, Ilaria Cesarini) coinvolgendo dati di Utenti o Fornitori Attacco informatico ai sistemi del responsabile, errore di configurazione che espone dati, accesso non autorizzato di un dipendente del responsabile Bassa (1). I responsabili sono soggetti professionali con infrastrutture certificate e DPA che impongono misure di sicurezza adeguate Parametro Valore Alta (3). L'impatto dipende dal responsabile coinvolto: un breach su Supabase o Anthropic potrebbe Gravità coinvolgere tutti gli Utenti; un breach su Stripe esporrebbe dati di riconciliazione pagamenti (non dati completi di carta) Rischio iniziale Medio (3) R9 — Esercizio dei diritti degli interessati inefficace o tardivo Parametro Valore Un interessato non riesce a esercitare efficacemente i diritti ex artt. 15-22 GDPR (accesso, rettifica, Descrizione cancellazione, limitazione, portabilità, opposizione) per inefficienze procedurali, dati distribuiti su più responsabili, tempi di risposta superiori al termine di legge Procedure non automatizzate, dipendenza da responsabili per l'estrazione dei dati, mancata Fonti designazione del referente privacy, complessità tecnica delle richieste (es. portabilità delle conversazioni con «Sole») Probabilità Bassa (1). La Piattaforma mette a disposizione funzioni automatiche per il download dei dati e la cancellazione dell'account; il Registro Reclami traccia ogni richiesta Gravità Media (2). L'impossibilità di esercitare i diritti vanifica le tutele del GDPR e può generare contenzioso Rischio iniziale Basso (2) R10 — Accesso ai dati da parte di Ilaria Cesarini senza DPA formalizzato Parametro Valore Descrizione Fonti Probabilità Ilaria Cesarini e il referente operativo Valerio Gestri mantengono accesso amministrativo ai sistemi (Supabase, Vercel, Stripe, Anthropic, Resend, Meta) per finalità di manutenzione dopo il lancio, senza che sia stato ancora sottoscritto l'Atto di Nomina a Responsabile ex art. 28 GDPR e senza che gli account dei servizi siano stati trasferiti all'utenza del Titolare Mancata sottoscrizione dell'atto prima del lancio; account ancora configurati sull'utenza di sviluppo; assenza di delimitazione contrattuale dell'ambito e della durata dell'accesso Media (2). Il passaggio di consegne è pianificato ma non ancora eseguito; la fase di transizione è il momento di massima vulnerabilità Alta (3). L'accesso amministrativo è potenzialmente illimitato e coinvolge tutti i dati personali trattati dalla Piattaforma. Il Garante ha inequivocabilmente sanzionato la mancanza di un accordo ex art. 28 Gravità GDPR come violazione autonoma (provv. n. 10039553/2024: «la nomina a responsabile del trattamento non costituisce un mero adempimento formale» e la sua assenza «determina l'illiceità del trattamento per difetto di base giuridica») Parametro Valore Rischio iniziale Alto (6)

4.3 Riepilogo rischi iniziali ID R6 Rischio

## P G R

Classe Dati di minori senza age verification R10 Accesso Ilaria Cesarini senza DPA 2 3 6 2 3 6 R3 R1 R4 R7 R8 R2 R5 R9 Output IA inappropriati o discriminatori 2 2 4 Accesso non autorizzato Profilazione non consensuale Trasferimento illecito extra-UE Data breach presso responsabili Divulgazione a Fornitore errato Perdita disponibilità dati Esercizio diritti inefficace 1 3 3 1 3 3 1 3 3 1 3 3 1 2 2 1 2 2 1 2 2

5. Misure di mitigazione

5.1 R6 — Dati di minori (rischio ALTO) # Misura Descrizione Alto Alto Medio Medio Medio Medio Medio Basso Basso Basso Responsabile Tempistica Blocco tecnico M6.1 under-14 La Piattaforma richiede la data di nascita in fase di registrazione e impedisce il completamento se l'età dichiarata è inferiore a 14 anni L'Informativa Privacy (art. 11) descrive il divieto di Informativa registrazione per minori di 14 anni; i dati di minori rafforzata partecipanti a esperienze sono trattati solo su base contrattuale e mai per profilazione Clausola Il Contratto Utente e il Contratto Fornitore qualificano l'età contrattuale come requisito essenziale M6.4 Monitoraggio segnalazioni verifica immediata e, dell'account Qualsiasi segnalazione di possibile minore registrato attiva se confermata, cancellazione M6.2 M6.3 Wondersun Supabase Wondersun Wondersun Referente privacy M6.5 Verifica rafforzata Valutare l'introduzione di meccanismi di age verification più robusti (es. SPID/CIE) per le funzionalità sensibili, sulla Wondersun base dei volumi e del tasso di segnalazioni / Già implementato Già implementato Già implementato 30 dal Entro giorni lancio Entro 6 mesi dal lancio Rischio residuo R6: Medio (4). La mitigazione riduce la probabilità ma non la elimina completamente in assenza di verifica robusta dell'età. Il rischio è accettabile nella fase di lancio in ragione della bassa probabilità e delle misure compensate; l'impegno a rivalutare entro 6 mesi è formalizzato.

5.2 R10 — Accesso Ilaria Cesarini senza DPA (rischio ALTO) # Misura Descrizione Responsabile Tempistica Firma Atto di M10.1 Nomina Sottoscrizione dell'Atto di Nomina a Responsabile ex art. 28 GDPR tra Ginevra Emanuele (Wondersun) e Ilaria Cesarini, completo di Allegato A (istruzioni documentate) Wondersun Ilaria Cesarini / Prima del lancio Trasferimento M10.2 account Trasferimento degli account Supabase, Vercel, Stripe, Anthropic, Meta, Resend dall'utenza Ilaria Cesarini all'utenza Wondersun, con consegna della documentazione DPA Ilaria Cesarini / Prima del Wondersun Formalizzazione del DPA Supabase tramite PandaDoc M10.3 DPA Supabase dall'area «Legal Documents» del dashboard, su account Wondersun intestato al Titolare Limitare l'accesso amministrativo alle sole risorse necessarie M10.4 Accesso profilato per la manutenzione; credenziali personali e dedicate per Ilaria Cesarini / Contestuale Ilaria Cesarini e Valerio Gestri; autenticazione a due fattori; Wondersun al DPA log degli accessi Clausola di M10.5 cessazione Prevedere contrattualmente la revoca delle credenziali e l'attestazione di restituzione/cancellazione dei dati al termine Wondersun del rapporto di manutenzione Contestuale al DPA Rischio residuo R10: Basso (2). Una volta formalizzato il DPA e completato il trasferimento account, l'accesso è giuridicamente inquadrato e tecnicamente delimitato. Questo rischio è la condizione sospensiva più urgente della presente DPIA.

5.3 R3 — Output IA inappropriati o discriminatori (rischio MEDIO) # Misura Descrizione Responsabile Tempistica I dati inviati a «Sole» non sono utilizzati da Anthropic per No training su addestrare i modelli, in forza dei termini contrattuali Anthropic M3.1 dati utenti standard (DPA incorporato nei Commercial Terms of Wondersun Service) lancio Prima del lancio M3.2 Cancellazione I dati sono cancellati automaticamente da Anthropic entro automatica circa 30 giorni, sempre in forza dei termini contrattuali Anthropic «Sole» attinge esclusivamente al catalogo Wondersun; non M3.3 Dominio limitato accede a fonti esterne, non naviga sul web, non utilizza dati Wondersun da social media / Già in vigore Già in vigore Già implementato # Misura Descrizione Responsabile Tempistica M3.4 Informativa trasparenza Identificazione M3.5 output IA L'Informativa sulla Trasparenza dell'IA descrive la logica di funzionamento, i limiti operativi e la natura orientativa dei Wondersun suggerimenti I suggerimenti generati da «Sole» sono sempre identificati come tali («Questo suggerimento è stato generato da Sole, Wondersun assistente IA»), in conformità all'art. 50, par. 1, AI Act Gli Utenti possono segnalare suggerimenti inappropriati, M3.6 Meccanismo di fuorvianti o discriminatori tramite il canale reclami; le feedback segnalazioni sono analizzate per correggere e migliorare il Wondersun sistema In assenza di consenso alla profilazione, «Sole» opera in M3.7 Doppio regime modalità standard senza accedere a dati personali, Wondersun eliminando il rischio di bias da profilazione Già implementato Da verificare al lancio 60 dal Entro giorni lancio Già implementato Rischio residuo R3: Basso (2). Le misure contrattuali e tecniche riducono significativamente probabilità e impatto. L'identificazione dell'output e il meccanismo di feedback offrono ulteriori presidi. Il rischio non è eliminabile del tutto (i LLM sono strutturalmente soggetti a bias e allucinazioni), ma è mitigato a un livello accettabile.

5.4 R1 — Accesso non autorizzato (rischio MEDIO) # Misura Descrizione M1.1 Cifratura in transito TLS per tutte le comunicazioni tra client e server e tra server e API dei responsabili M1.2 Cifratura a riposo Dati cifrati su Supabase M1.3 Password cifrate Hashing con salt per tutte le password M1.4 Controllo accessi RBAC (Role-Based Access Control) per tutti gli accessi amministrativi M1.5 Log accessi Registrazione e monitoraggio di tutti gli accessi amministrativi M1.6 Backup Backup giornalieri con procedure di ripristino verificate

## M1.7 DPA

Accordi ex art. 28 GDPR con tutti i responsabili, inclusi obblighi di sicurezza Rischio residuo R1: Basso (2).

5.5 R4 — Profilazione non consensuale (rischio MEDIO) # Misura Descrizione M4.1 Consenso granulare Checkbox distinta e non preselezionata in fase di registrazione, separata dall'accettazione del Contratto M4.2 Segregazione tecnica Dati di profilazione logicamente separati dai dati contrattuali M4.3 Revoca consenso Funzione «Preferenze privacy» nell'area riservata per revocare il consenso in ogni momento # Misura Descrizione M4.4 Registro Consensi Tracciatura automatica di ogni consenso e revoca su Supabase, con data, ora e valore del flag M4.5 Cancellazione automatica I dati di profilazione sono cancellati automaticamente alla revoca del consenso e in ogni caso dopo 24 mesi di inattività M4.6 Esclusioni tecniche Sono esclusi dalla profilazione: dati sensibili, dati di geolocalizzazione, dati da social media, dati di minori, dati di navigazione esterna Rischio residuo R4: Basso (1).

5.6 R7 — Trasferimento illecito extra-UE (rischio MEDIO) # Misura Descrizione M7.1 DPF certificato M7.2 Hosting in UE Tutti i responsabili USA (Stripe, Anthropic, Meta, Resend) sono certificati EU-US Data Privacy Framework Supabase e Vercel operano su server in Irlanda e Francoforte — nessun trasferimento extra-UE Ilaria Cesarini M7.3 Italia in Il Responsabile opera dalla sede di Grosseto — nessun trasferimento extra-UE M7.4 Monitoraggio DPF ufficiale www.dataprivacyframework.gov Verifica periodica (almeno annuale) della persistenza della certificazione DPF tramite il sito Piano M7.5 contingenza di In caso di invalidazione del DPF, migrazione verso SCC o valutazione di responsabili alternativi con sede in UE Rischio residuo R7: Basso (2).

5.7 R8 — Data breach presso responsabili (rischio MEDIO) # Misura Descrizione DPA con obblighi M8.1 breach Tutti i DPA prevedono l'obbligo di notifica immediata al Titolare in caso di data breach M8.2 Registro Breach Data Predisposto registro delle violazioni ex art. 33, par. 5, GDPR M8.3 Procedura gestione M8.4 Obblighi specifici di Il referente privacy valuta entro 24 ore dalla notifica la necessità di notifica al Garante (entro 72 ore) e di comunicazione agli interessati Ilaria Cesarini (Atto di Nomina, art. 6) e i Fornitori (Contratto Fornitore, art. 19.2) hanno obblighi di notifica breach entro 24 ore Rischio residuo R8: Basso (2).

5.8 Rischi bassi (R2, R5, R9)

- R2 (Divulgazione a Fornitore errato): il sistema associa univocamente ogni Richiesta alla Scheda del
Fornitore; verifica pre-invio. Rischio residuo: Basso (1).

- R5 (Perdita disponibilità): backup giornalieri su Supabase; ridondanza AWS eu-west-1; disaster
recovery. Rischio residuo: Basso (1).

- R9 (Esercizio diritti inefficace): funzioni automatiche di download dati e cancellazione account nell'area
riservata; canale e-mail/PEC dedicato; Registro Reclami con tracciatura. Rischio residuo: Basso (1).

6. Rischio residuo e conclusioni

6.1 Tabella riepilogativa ID Rischio R6 Dati di minori R10 Accesso Ilaria Cesarini senza DPA R3 Output IA inappropriati R1 Accesso non autorizzato R4 Profilazione non consensuale R7 Trasferimento illecito extra-UE R8 Data breach responsabili R2 Divulgazione Fornitore errato R5 Perdita disponibilità dati R9 Esercizio diritti inefficace

6.2 Giudizio complessivo Rischio iniziale Rischio residuo Variazione Alto (6) Alto (6) Medio (4) Medio (3) Medio (3) Medio (3) Medio (3) Basso (2) Basso (2) Basso (2) Medio (4) Basso (2) Basso (2) Basso (2) Basso (1) Basso (2) Basso (2) Basso (1) Basso (1) Basso (1) ↓ ↓↓↓ ↓↓ ↓ ↓↓ ↓ ↓ ↓ ↓ ↓ Tutti i rischi residui sono classificati come Medi o Bassi. Nessun rischio residuo è Alto. I due rischi inizialmente Alti (R6 e R10) sono stati ridotti rispettivamente a Medio e Basso. Per R6 (minori) permane un rischio residuo Medio in ragione dell'assenza di un sistema di age verification robusto, compensato dalle misure di mitigazione implementate e dall'impegno a rivalutare entro 6 mesi. Per R10 (accesso Ilaria Cesarini) il rischio residuo è Basso ma è condizionato al completamento delle attività di cui alla Sezione 7. Il rischio R3 (output IA), pur mitigato a Basso, merita un monitoraggio continuativo, data la natura evolutiva dei LLM e la novità dell'applicazione nel contesto turistico-ricreativo.

6.3 Consultazione preventiva del Garante Non si ravvisano i presupposti per la consultazione preventiva dell'Autorità di controllo ai sensi dell'art. 36 GDPR, non residuando alcun rischio elevato dopo l'adozione delle misure di mitigazione.

7. Condizioni sospensive La validità della presente DPIA è subordinata al completamento, prima del lancio della Piattaforma, delle seguenti attività: # Attività Responsabile Rischio mitigato Sottoscrizione dell'Atto di Nomina a Responsabile ex art. 28 GDPR tra 1 Ginevra Emanuele (Wondersun) e Ilaria Cesarini, con Allegato A (istruzioni R10 Wondersun / Ilaria Cesarini documentate) documentazione DPA 2 3 # Attività Responsabile Rischio mitigato Trasferimento degli account dei servizi (Supabase, Vercel, Stripe, Anthropic, Meta, Resend) dall'utenza Ilaria Cesarini all'utenza Wondersun e consegna della

## R10, R7

Ilaria Cesarini / Wondersun Formalizzazione del DPA Supabase tramite PandaDoc dall'area «Legal Documents» del dashboard, su account intestato al Titolare Wondersun

## R7, R8

Il mancato completamento anche di una sola di queste attività prima del lancio impone l'aggiornamento immediato della presente DPIA con una nuova valutazione dei rischi R10, R7 e R8.

8. Revisione e aggiornamento Ai sensi dell'art. 35, par. 11, GDPR e delle Linee guida WP248, la presente DPIA è soggetta a revisione: Revisione ordinaria:

- Con cadenza annuale (luglio 2027) o in coincidenza con il rinnovo delle certificazioni DPF dei responsabili
USA. Revisione straordinaria in caso di:

- 
introduzione di nuove funzionalità (es. integrazione di analytics, nuovi canali di comunicazione, evoluzioni del modello IA, attivazione di newsletter);

- 
cambiamento di uno o più responsabili del trattamento o della loro ubicazione geografica;

- modifiche normative rilevanti (es. atti delegati AI Act, nuove linee guida EDPB o Garante, invalidazione
del DPF);

- data breach significativi che rivelino rischi non precedentemente considerati;
- 
- 
superamento di soglie quantitative di Utenti o Fornitori che modifichino la scala del trattamento; esito della rivalutazione sull'age verification per minori (entro 6 mesi dal lancio). Documento redatto da: Wondersun — Titolare del trattamento Data: 13 luglio 2026 Approvato dal Titolare: Ginevra Emanuele
