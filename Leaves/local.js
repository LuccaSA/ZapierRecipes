
var fetch = require('../node_modules/node-fetch');

var input = {
    url: getUrlBase(process.argv[2]),
    appToken: process.argv[3],
    offsetDays: 2,
    numberDayMinimum: 5
};

var callback = function (error, success) {
    console.log(success.message);
};

// Variable de message d'erreur. (PAS BESOIN DE LE METTRE DANS LA RECETTE)
var errorNotEnoughtParam = 'erreur: besoin de deux arguments (url et token).';
var errorEmptyParam = 'erreur: l\'un des arguments et vide.';

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