// Variable de message d'erreur.
var errorNotEnoughtParam = 'erreur: besoin de deux arguments.';
var errorEmptyParam = 'erreur: l\'un des arguments et vide.';

var fetch = require('node-fetch');
var getNextWorkingDate = require('./date.js');

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

var tmp = getNextWorkingDate();
var when = tmp[0];
var curDay = tmp[1];

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
    callback(null, result);
  }).catch(function (error) {
    console.log(error);
  });