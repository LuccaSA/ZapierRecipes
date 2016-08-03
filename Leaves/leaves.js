// Variable de message d'erreur.
var errorNotEnoughtParam = 'erreur: besoin de deux arguments.';
var errorEmptyParam = 'erreur: l\'un des arguments et vide.';

var fetch = require('node-fetch');
var _ = require('lodash');

// Vérification du bon nombre de paramètres.

if (process.argv.length !== 4) {
  console.log(errorNotEnoughtParam);
  return;
}

// Vérification que les paramètres ne sont pas vide.

if (process.argv[2] === '' || process.argv[3] === '') {
  console.log(errorEmptyParam);
  return;
}

// Fonction qui permet à partir du paramètre params de retourner l'url qui sera utilisé.

function getUrlBase(params) {
  var endUrlBase = '/api/v3/leaves?leavePeriod.ownerId=greaterthan,0';

  if (!params.match('^https://')) {
    params = 'https://' + params;
  }
  if (!params.match('(.ilucca.net)$')) {
    params = params + '.ilucca.net';
  }
  return (params + endUrlBase);
}

var callback = function (error, success) {
	 console.log(success);
};

// Création de toutes les variables pour la date.

var today = new Date();
var curDay = {};

// On regarde non pas aujourd'hui mais demain.
today.setDate(today.getDate() + 1);

// Si la date tombe un dimanche on va jusqu'au lundi. (Il faudra aussi changer les messages d'erreur.)
var when = 'demain';
var move = 0;

if (today.toDateString().split(' ')[0] === 'Sat') {
    move = 2;
}
if (today.toDateString().split(' ')[0] === 'Sun') {
    move = 1;
}

today.setDate(today.getDate() + move);

curDay.yearS = '' + today.getFullYear();
curDay.month = today.getMonth() + 1;
curDay.monthS = curDay.month > 9 ? '' + curDay.month : '0' + curDay.month;
curDay.dayS = today.getDate() > 9 ? '' + today.getDate() : '0' + today.getDate();
curDay.todayS = curDay.yearS + '-' + curDay.monthS + '-' + curDay.dayS;

var urlBase = getUrlBase(process.argv[2]);
var appToken = process.argv[3];
console.log(urlBase + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]');

// Permet d'obtenir la liste des personnes à vérifier et de savoir si elles sont absentes ou non.

fetch(urlBase + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]', {
  'headers': {
    'Authorization': 'lucca application=' + appToken
  }
})
  .then(function (res) {
    return res.json();
  }).then(function (data) {
    console.log(data);
    var leaves = data.data.items;
    var hash = {};
    var result = [];
    for (var i = 0; i < leaves.length; i++) {
      var leave = leaves[i];
      var username = leave.leavePeriod.owner.name;
      var userleave = hash[username];
      if (!userleave) {
        userleave = {
          morning: false,
          afternoon: false,
          end: leave.leavePeriod.endsOn.split('T')[0]
        };
        hash[username] = userleave;
        result.push({
          name: username,
          leave: userleave
        });
      }
      if (leave.isAM) {
        userleave.morning = true;
      } else {
        userleave.afternoon = true;
      }
    }

    for (var i = 0; i < result.length; i++) {
      var curRes = result[i];
      if (curRes.leave.morning && curRes.leave.afternoon) {
        curRes.detail = when + ' toute la journée';
      } else if (curRes.leave.morning) {
        curRes.detail = when + ' matin';
      } else {
        curRes.detail = when + ' après-midi';
      }
      if (curRes.leave.end !== curDay.todayS) {
        var endSp = curRes.leave.end.split('-');
        curRes.detail += ' et jusqu\'au ' + endSp[2] + '/' + endSp[1] + '/' + endSp[0] + ' inclus';
      }
    }
    if (result.length === 0) {
      result.push({
        name: 'Personne n\'',
        detail: when
      });
    }

    _.forEach(result, function (result) {
      console.log(result.name + ' est absent(e) ' + result.detail);
    });

    callback(null, result);
  }).catch(function (error) {
    console.log(error);
  });