// Fichier de variable pour l'utilisation en locale

var fetch = require('../node_modules/node-fetch');

var input = {
    url: getUrlBase(process.argv[2]),
    appToken: process.argv[3],
    offsetDays: 2,
    numberDayMinimum: 0,
    validDepartment: 'Paris,Tours,Nantes'
};

var callback = function (error, success) {
    console.log(success.message);
};

var errorNotEnoughtParam = 'erreur: besoin de deux arguments (url et token).';
var errorEmptyParam = 'erreur: l\'un des arguments et vide.';

// Vérification pour les paramètres envoyée en locale

if (process.argv.length !== 4) {
    console.log(errorNotEnoughtParam);
    return;
}

if (process.argv[2] === '' || process.argv[3] === '') {
    console.log(errorEmptyParam);
    return;
}

// Fonction qui permet de retourner une url v3

function getUrlBase(params) {
    if (!params) {
        return null;
    }
    var endUrlBase = '/api/v3/leaves?leavePeriod.ownerId=greaterthan,0';

    if (!params.match('^https://')) {
        params = 'https://' + params;
    }
    if (!params.match('(.ilucca.net)$')) {
        params = params + '.ilucca.net';
    }
    return (params + endUrlBase);
}