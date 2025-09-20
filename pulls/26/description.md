# Descrizione della PR #26

## Stato attuale (vedi screenshot allegati)
- La pagina di richiesta accesso non mostra il campo password, come da screenshot ![image1](image1).
- Se si tenta di registrarsi (inserendo solo nome, email, ruolo, motivazione), compare il popup di errore "Failed to submit access request. Please try again." (![image2](image2)).
- Probabile causa: il backend si aspetta un campo password che il frontend non invia, oppure la logica tra frontend e backend non è allineata.

## Cosa bisogna correggere
1. **Aggiungere il campo password** al form di signup, con validazione (almeno una maiuscola, un numero, minimo 8 caratteri).
2. **Gestire la validazione** sia lato frontend che backend.
3. **Sincronizzare la logica di richiesta/accesso** tra frontend e backend (i dati inviati dal form devono essere quelli attesi dall’API).
4. **Mostrare feedback utente chiaro** in caso di errore o successo.
5. **Testare** che la registrazione vada a buon fine e che l’errore sia specifico se c’è un problema.

#### Screenshot di riferimento
- ![image1](image1)
- ![image2](image2)

---