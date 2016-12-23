if (process.argv.length !== 5) {
  console.log('Usage: gulp dev && node dist/build.js slack_token jira_token jira_project_id');
  return;
}

var slackToken = process.argv[2];
var jiraToken = process.argv[3];
var jiraProjectId = process.argv[4];

(function () {
  var Botkit = require('botkit');

  var controller = Botkit.slackbot({
    debug: false
  });

  controller.spawn({
    token: slackToken
  }).startRTM();

  var proposition = null;
  var linkList = [];
  var userId = null;

  var sendMessage = function (bot, message, text) {
    bot.reply(message, {
      text: text,
      username: 'SantaBot',
      icon_emoji: ':santa:'
    })
  };

  controller.hears(['bonjour', 'hello', 'reset', 'send', 'help', 'show'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {

    // A remplacer avec un switch - cbouchard
    if (message.text === 'bonjour' || message.text === 'hello') {
      sendMessage(bot, message, 'Bonjour, quelle est votre demande ? (Pour lister les commandes -> help)');
    } else if (message.text === 'reset' && proposition) {
      sendMessage(bot, message, 'Votre demande a été supprimée');
      proposition = null;
      linkList = [];
      userId = null;
    } else if (message.text === 'send' && proposition) {
      sendMessage(bot, message, 'Votre proposition est envoyé, merci à vous.');
      sendIssueToJira(proposition, userId, linkList);
      proposition = null;
      linkList = [];
      userId = null;
    } else if (message.text === 'help') {
      sendMessage(bot, message, 'send: envoie la demande\nreset: supprime la demande en cours\nshow: montre la demande en cours\n\nVous pouvez écrire n\'importe quel message pour mettre à jour le message de votre demande.\nVous pouvez ajouter des images à votre demande en les ajoutant sur ce channel.');
    } else if (message.text === 'show') {
      var showMessage = 'Demande : ' + (proposition ? proposition : '');
      showMessage += '\nDocument(s) : \n' + (linkList !== [] ? linkList.join('\n') : '');
      sendMessage(bot, message, showMessage);
    }
  });

  controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
      sendMessage(bot, message, 'Votre message a été mis à jour.');
      proposition = message.text;
      userId = message.user;
  });

  controller.on('file_share', function (bot, message) {
      sendMessage(bot, message, 'Ce document à été ajouté.');
      linkList.push(message.file.url_private);
  });
})();
