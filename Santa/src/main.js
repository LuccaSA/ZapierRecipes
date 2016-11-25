(function () {
  var Botkit = require('botkit');

  var controller = Botkit.slackbot({
    debug: false
  });

  controller.spawn({
    token: process.env.token // Changer avec le token du bot en question
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
    bot.startConversation(message, function (response, convo) {
      sendMessage(bot, message, 'Voulez vous changer le message de votre prochaine demande ? (oui/non)');
      convo.ask('', [
        {
          pattern: 'oui',
          callback: function (response, convo) {
            sendMessage(bot, message, 'Votre message a été mis à jour');
            proposition = message.text;
            userId = message.user;
            convo.next();
          }
        },
        {
          pattern: 'non',
          callback: function (response, convo) {
            sendMessage(bot, message, 'Votre message n\'a pas été mis à jour');
            convo.next();
          }
        },
        {
          default: true,
          callback: function (response, convo) {
            sendMessage(bot, message, 'Voulez vous changer le message de votre prochaine demande ? (oui/non)');
            convo.repeat();
            convo.next();
          }
        }
      ]);
    })
  });

  controller.on('file_share', function (bot, message) {
    bot.startConversation(message, function (response, convo) {
      sendMessage(bot, message, 'Voulez vous ajouter ce document à votre prochaine demande ? (oui/non)');
      convo.ask('', [
        {
          pattern: 'oui',
          callback: function (response, convo) {
            sendMessage(bot, message, 'Document ajouté');
            linkList.push(message.file.url_private);
            convo.next();
          }
        },
        {
          pattern: 'non',
          callback: function (response, convo) {
            sendMessage(bot, message, 'D\'accord, ce document n\'a pas été ajouté.');
            convo.next();
          }
        },
        {
          default: true,
          callback: function (response, convo) {
            sendMessage(bot, message, 'Voulez vous ajouter ce document à votre prochaine demande ? (oui/non)');
            convo.repeat();
            convo.next();
          }
        }
      ]);
    })
  });

})();
