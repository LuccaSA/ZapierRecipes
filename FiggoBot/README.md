Bot Figgo
===

Bot ayant pour le moment trois fonctions :
* Permet a un utilisateur de savoir qui est absent à une date donné en écrivant un message du type `JJ/MM/AAAA`
* Permet d'afficher l'aide en tapant le message `help`
* Permet de savoir le prochain jour ou tout le monde est présent en tapant le message `everyoneavailable`

Ce script utilise un token slack, l'intégration lié à ce token doit avoir été ajouté aux channels dans lesquels on veut pourvoir utiliser le bot figgo. On peut aussi créer un bot, c'est alors sur le channel de ce bot que l'on pourra faire ses demandes.

Utilisation
---
Tout d'abord il faut installer les modules avec (dans le dossier) :
```
$ npm install
```

Puis le lancer avec (dans le dossier) :
```
$ gulp dev && node dist/build.js slack_token lucca_token
```
* slack_token : token pour accéder à l'api de slack
* lucca_token : token pour accéder à l'api de lucca
