Closing (lampe hue)
===

Ce bot utilise le module `node-fetch` et `slackbots` pour les installer lancez :
```
$ npm install
```

Il permet de faire clignoter les lampes hue quand un message est reçu sur un channel slack.

Utilisation
---

Vous pouvez ensuite les lancer avec :
```
$ node src/main.js token_channel_slack id_channel
```

* token_channel_slack: correspond à un token pour une équipe slack.
* id_channel: correspond à l'id du channel écouter.
