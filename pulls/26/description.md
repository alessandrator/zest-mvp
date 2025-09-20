# Descrizione della PR #26

## Stato attuale (vedi screenshot allegati)
- La pagina di richiesta accesso non mostra il campo password, come da screenshot ![image1](image1).
- Se si tenta di registrarsi (inserendo solo nome, email, ruolo, motivazione), compare il popup di errore "Failed to submit access request. Please try again." (![image2](image2)).
- In Supabase non risultano bucket di storage creati (![image3](image3)).
- Nel database non ci sono nemmeno tabelle nello schema "public" (![image4](image4)).
- Probabile causa: il backend si aspetta un campo password che il frontend non invia, oppure la logica tra frontend e backend non è allineata. Inoltre il database non è ancora stato strutturato, quindi nessun dato può essere salvato.

## Cosa bisogna correggere
1. **Aggiungere il campo password** al form di signup, con validazione (almeno una maiuscola, un numero, minimo 8 caratteri).
2. **Gestire la validazione** sia lato frontend che backend.
3. **Sincronizzare la logica di richiesta/accesso** tra frontend e backend (i dati inviati dal form devono essere quelli attesi dall’API).
4. **Mostrare feedback utente chiaro** in caso di errore o successo.
5. **Testare** che la registrazione vada a buon fine e che l’errore sia specifico se c’è un problema.
6. **Configurare le tabelle e lo storage su Supabase** secondo quanto richiesto dal modello dati.

## Struttura delle tabelle da creare su Supabase

Le tabelle devono essere differenziate in base al tipo di utente. Ogni dashboard deve poter accedere alle informazioni rilevanti e consentire le operazioni specifiche di quel tipo di utente.

---

### Utente Studente
- id (UUID)
- nome
- cognome
- email
- password (criptata)
- immagine profilo (URL o riferimento a bucket storage)
- scuola di appartenenza (collegamento tabella scuole)
- data registrazione
- campagne_accettate (relazione: id studente, id campagna, stato accettazione, data accettazione)
- progetti (relazione: id progetto, id campagna, file/immagini [limite 10MB], stato approvazione superadmin, data upload)
- voto (relazione: id voto, id studente, id progetto/campagna, valore voto, data voto)

### Utente Creator
- id (UUID)
- nome
- cognome
- email
- password (criptata)
- immagine profilo (URL o riferimento a bucket storage)
- portfolio link/upload (opzionale)
- data registrazione
- progetti (relazione: id progetto, id campagna, file/immagini [limite 10MB], stato approvazione superadmin, data upload)
- voto (relazione: id voto, id creator, id progetto/campagna, valore voto, data voto)
- upload immagini e descrizione approvati dal superadmin

### Scuola/Brand/Ente
- id (UUID)
- nome scuola/brand/ente
- referente (nome, cognome, email)
- password (criptata)
- logo/immagini (URL storage)
- data registrazione
- campagne (relazione: id campagna, titolo, brief, foto di riferimento, stato approvazione superadmin, data creazione - max 10 campagne per scuola/brand)
- test_mercato (tabella: id test, titolo, descrizione, domande, test, foto, stato approvazione superadmin, data creazione)

### Tabelle di relazione e supporto
- **Richieste di accesso** (id, utente, tipo utente, stato approvazione, data richiesta)
- **Campagne** (id, titolo, brand/scuola, stato pubblicazione, lista studenti/creator che hanno accettato)
- **Progetti** (id, utente, campagna, file, immagini, descrizione, stato approvazione, data upload)
- **Voti** (id, utente, progetto/campagna, valore voto, data voto)
- **Test di mercato** (id, scuola, titolo, domande, risposte, foto, stato approvazione, data creazione)

## Storage
Per immagini profilo, portfolio, loghi, file progetto, ecc. utilizzare i bucket di storage Supabase, suddivisi per tipologia di file/utente. Impostare un limite di dimensione file (es. max 10 MB per file e immagine).

---

#### Screenshot di riferimento
- ![image1](image1) (form senza campo password)
- ![image2](image2) (errore submit)
- ![image3](image3) (storage vuoto Supabase)
- ![image4](image4) (nessuna tabella su Supabase)

---

> **Nota:** Dopo aver creato le tabelle e configurato lo storage, testare la registrazione e assicurarsi che i dati vengano salvati correttamente per ogni tipologia utente e che tutti i flussi (upload, accettazione campagne, voto, pubblicazione campagne/test mercato) funzionino come previsto.