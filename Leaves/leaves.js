// Variable de message d'erreur. (PAS BESOIN DE LE METTRE DANS LA RECETTE)
var errorNotEnoughtParam = 'erreur: besoin de deux arguments (url et token).';
var errorEmptyParam = 'erreur: l\'un des arguments et vide.';

var getNextWorkingDate = require('./date.js');
var request = require('./request.js');

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
  for (var i = 0; i < success.length; i++) {
    console.log(success[i].name + ' est absent(e) ' + success[i].detail);
  }
};

var tmp = getNextWorkingDate(1);
var when = tmp[0];
var curDay = tmp[1];

var urlBase = getUrlBase(process.argv[2]);
var appToken = process.argv[3];
console.log(urlBase + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]');

// Permet d'obtenir la liste des personnes à vérifier et de savoir si elles sont absentes ou non

var result = [];

// On lance la recherche pour J+1

request(result, secondStep, urlBase, curDay, appToken, when, -1);

// Puis la recherche pour J+2

var secondStep = function () {

  var tmp = getNextWorkingDate(2);
  var when = tmp[0];
  var curDay = tmp[1];

  request(result, thirdStep, urlBase, curDay, appToken, when, 5);
};

// Et enfin la recherche pour J+5

var thirdStep = function () {

  var tmp = getNextWorkingDate(5);
  var when = tmp[0];
  var curDay = tmp[1];

  request(result, callback, urlBase, curDay, appToken, when, 10);
}