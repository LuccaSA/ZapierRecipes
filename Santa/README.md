Bot Père Noël
===

Lancer des demandes `Père noël` et de créer automatiquement un ticket sur Jira

Pour faire une demande il faut écrire un message sur le channel du bot père noël. Pour valider le changement de texte de la demande taper le message `send` sur le channel. On peut rajouter des captures d'écran en partageant sur le channel un fichier (fichier image ou pdf).

Utilisation
---
Pour le lancer il faut tout d'abord installer les modules (dans le dossier) :
```
$ npm install
```

Puis le lancer avec (dans le dossier) :
```
$ gulp dev && node dist/build.js slack_token jira_token jira_project_id
```

* slack_token : token pour utiliser l'api slack_token
* jira_token : compte:mdp en base64 pour accéder à l'API de jira
* jira_project_id : id du projet jira sur lequel on va créer les tickets père noël. (l'utilisateur du jira_token doit y avoir accès)
