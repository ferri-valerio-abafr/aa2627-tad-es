---
description: Pubblica il lavoro e ricorda come segnalare la consegna
---

Preparare la consegna dell'attività `$1`.

Se `$1` non è uno dei nomi ammessi (`es1`, `es2`, …), ricondurlo al nome giusto e dirlo. Se `$1` è il progetto, fermarsi: il progetto ha un repository suo, creato dallo studente, e si consegna allo stesso modo ma a partire da lì.

1. Controllare che nella cartella ci siano `index.html`, `sketch.js`, `style.css` e `preview.png`, e che l'`index.html` della radice contenga la voce corrispondente. Se manca l'anteprima `preview.png`, dirlo: serve all'elenco dei lavori e alla pagina delle revisioni del corso, ed è richiesta dalla consegna. Controllarne il nome anche in Git, con `git ls-files <cartella>`: deve essere `preview.png`, tutto in minuscolo. Windows e macOS non distinguono le maiuscole nei nomi dei file, GitHub Pages sì, quindi con `Preview.png` o `preview.PNG` l'immagine si vede sul computer ma non online. Se il nome è diverso, proporre di correggerlo con `git mv -f <cartella>/<nome attuale> <cartella>/preview.png`.
2. Fare la **verifica delle specifiche**, come in `/verifica`: leggere la consegna sul sito e confrontarla con il lavoro. Se qualche vincolo non è rispettato, elencare in due righe quali sono e **chiedere se consegnare lo stesso**. La consegna non si blocca mai: lo studente decide, ma deve saperlo prima e non dopo.
3. Mostrare lo stato del repository: !`git status --short`
4. Se ci sono modifiche da pubblicare, chiedere conferma, poi fare il commit con un messaggio che dica che cosa è stato fatto e sincronizzare con GitHub.
5. Comporre l'indirizzo pubblico del lavoro dal proprietario e dal nome del repository remoto (`https://NOMEUTENTE.github.io/NOMEREPOSITORY/<cartella>/`; in questo repository il nome è `aa2627-tad-es`). Verificare che l'indirizzo sia raggiungibile sul web prima di presentarlo come pubblicato: la sincronizzazione Git non attiva GitHub Pages. Se risponde 404 o Pages non è attivo, dirlo esplicitamente e indicare di abilitarlo in GitHub, *Settings › Pages › Deploy from a branch › main › / (root) › Save*; mostrare l'indirizzo solo come URL previsto, non come pagina già online.
6. Solo se l'indirizzo è raggiungibile, ricordare come si segnala la consegna: si compila il **modulo delle consegne**, il cui indirizzo sta nel `README.md` alla sezione «Come si consegna», indicando l'esercitazione, l'indirizzo pubblico ed eventuali note. Se Pages non è attivo, spiegare che prima va abilitato e verificato; non invitare a indicare nel modulo un link non funzionante. La revisione non arriva qui ma nella chat di Teams.

Chiudere con poche righe: l'esito della verifica, l'indirizzo del lavoro e il rimando al modulo. Non ripetere passo per passo quello che si è appena fatto.
