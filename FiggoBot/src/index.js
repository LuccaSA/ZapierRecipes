var zapierToken = process.env.zapierToken;
////////////////////////////

var Botkit = require('botkit');

// Initialisation du bot
var controller = Botkit.slackbot({
  debug: false
});

// Fonction de vérification d'une date
var isGoodDate = function (day, month, year) {
  var date = new Date(year, month - 1, day);
  if (date.getDate() != day || date.getFullYear() != year || date.getMonth() + 1 != month) {
    return false;
  }
  return true;
}

// Lancement du bot
controller.spawn({
  token: process.env.token,
}).startRTM()

// Ecoute toutes expressions du type 'DD/MM/YYYY' et affiche le nombre d'absents et leur nom.
controller.hears('^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$', ['direct_message','direct_mention','mention'], function(bot, message) {
  var userMessage = message.text;
  var dateMatch = message.match;
  var slack = {};

  slack.bot = bot;
  slack.message = message;
  if (isGoodDate(dateMatch[1], dateMatch[2], dateMatch[3])) {
    var requestDate = dateMatch[3] + '-' + dateMatch[2] + '-' + dateMatch[1];
    sendAbsentOnLuccaFormDateToSlack(requestDate, zapierToken, answerToSlackUser, slack);
  }
});

// Ecoute le mot 'help' et permet d'afficher l'aide
controller.hears('help', ['direct_message','direct_mention','mention'], function(bot, message) {
  var helpMessage = ''

  helpMessage += 'Message d\'aide pour l\'utilisation du bot figgo\n';
  helpMessage += '\n'
  helpMessage += 'DD/MM/YYYY: renvoie le nombre d\'absents à la date donnée\n';
  helpMessage += 'everyoneavailable: renvoie la prochainne date ou tout le monde est présent\n';
  bot.reply(message, helpMessage);
});

// Ecoute le mot 'everyoneavailable' et affiche la prochaine date à laquelle il n'y a aucun absents.
controller.hears('everyoneavailable', ['direct_message','direct_mention','mention'], function(bot, message) {
  var todayDate = new Date();

  var sendResult = function (date) {
    var responseMessage = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    bot.reply(message, responseMessage);
  };

  var launchRequest = function (date, token) {
    var fetch = require('node-fetch');
    var request_url = 'https://lucca.ilucca.net/api/leaves?date=';

    request_url += date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    fetch(request_url, {
      'headers': {
        'Authorization': 'lucca application=' + token
      }
    })
    .then(res => res.json())
    .then(function (data) {
        // Si il y a des absents on boucle sur l'appel de fonction
        if (data.data.length === 0) {
          sendResult(date);
        } else {
          date.setDate(date.getDate() + 1);
          launchRequest(date, token);
        }
    }).catch(error => console.log(error));
  };
  launchRequest(todayDate, zapierToken);
});
