[![Build Status](https://travis-ci.org/ngrome/codebattle-nodejs.svg?branch=master)](https://travis-ci.org/ngrome/codebattle-nodejs)

Backend per il Code Battle di Skaffolder, scritto in NodeJS, TypeScript utilizzando Express e Mongoose come librerie principali e la librerie Express/Decorators.
Per l'ambiente di test è stato utilizzato Jest e creati dei mock.
Per l'avvio con TypeScript è stato utilizzato ts-node.

# Errori riscontrati

FRONTEND Skaffolder per prova: [http://challenge.skaffolder.com/](FRONTEND)

* Da FRONTEND Skaffolder, quando si clicca su FilmMaker e si aggiungere un item, il frontend fa una richiesta GET ad una API che non era in documentazione: /api/films/findByfilmMaker/new
Questo porta ad una "rottura" dell'interfaccia grafica che non dipende dal backend;
* Da FRONTEND Skaffolder, quando creo un nuovo utente e aggiungo più gruppi (ROLES), l'interfaccia propone a tutti lo stesso nome del ruolo, ma nel database vengono creati i ruoli giusti e, successivamente, nell'elenco degli utenti, i ruoli sono scritti correttamente;
* Da FRONTEND Skaffolder, quando clicco per fare l'EDIT di un FILM spesso ottengo errori del tipo: "ERROR TypeError: Cannot read property 'filter' of undefined..." che invalidano l'interfaccia. Questo succede sia se uso il BACKEND Skaffolder che questo BACKEND.

# Installazione

Creare un file di configurazione `index.ts` in `./src/config` utilizzando il file template. Specificare le credenziali e l'url di una istanza mongoDB.

Avviare l'installazione dei packages con NPM.

```
npm i
npm run start:dev
```

Avviato il server esegui una POST con POSTMAN per la creazione di un utente "admin" e senza nessuna specifica di autorizzazione (nella realtà non sarà così ovviamente!):

```
{
	"password": "1a1dc91c907325c69271ddf0c944bc72",
	"username": "admin",
	"mail": "email@mail.com",
	"roles":["ADMIN"]
}
```

```
npm run test

# singoli test:
npm run test server
npm run test actor
npm run test security

```

# Heroku

* Creare un account su Heroku
* Installare Heroku CLI: `brew install heroku`
* Fai il login su Heroku con: `heroku login`
* Crea il progetto Heroku con: `heroku create`
* Fai il push: `git push heroku master`
* Imposta le Variabili di Ambiente per MLAB (heroku config:get MONGODB_URI)
* Porta dinamica di Heroku: process.env.PORT || 3000
* Specificare la versione di NodeJS
* Specificare lo script di avvio
* Specifica sempre un .gitignore

# JWT

Il JWT viene acquisito in fase di LOGIN e inviato nelle successive richieste nel formato:

`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTZhMGZmZGJlYjg3MzBjYjM2YWE5NCIsIl9pZCI6IjVhYTZhMGZmZGJlYjg3MzBjYjM2YWE5NCIsIm1haWwiOiJsLmZyYW5jZXNjaGluaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6bnVsbCwic3VybmFtZSI6bnVsbCwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE1MjA4NzIxMTIsImV4cCI6MTUyMDk3MjExMn0.0h6XZCIqDgiHFqx3Py-BcGEbszwcRqyD4esqjKeswjo`

all'interno dell'Authorization Header della richiesta HTTP.
Posso omettere lo schema Bearer.

# Mongoose

_I Documents sono istanze dei nostri Model! (doc mongoose)_

Un **modello** (che rappresenta la collezione) di mongoose implementa dei metodi di "lettura" che possiamo definire di default per tutti i modelli della collezione e sono:
  * findById (potenzialmente null)
  * findOne (potenzialmente null)
  * find (lista di documenti anche vuota)
a questi potremmi aggiungere un metodo conveniente:
  * all (lista di tutti di documenti anche vuota)

Per i metodi di "scrittura" invece troviamo:
  * create
  * update
  * remove

Per questo motivo possiamo creare due interfacce di IRead e IWrite che dichiarano questi metodi e creare una classe base di Modello per i modelli concreti.

Le interfacce saranno di tipo <T> in quanto dovranno accettare diversi modelli.


# Riferimenti

[https://gallery.technet.microsoft.com/Application-Example-NodeJS-d632ee2d](Technet Microsoft)
[http://mongoosejs.com/docs/api.html](API Mongoose)
[http://docs.sequelizejs.com/manual/tutorial/models-usage.html](Sequelize)
[https://facebook.github.io/jest/](JEST)
[https://github.com/serhiisol/node-decorators/tree/master/express](Libreria Express @Decorators)
