// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var sendResult = function (results) {
  var res = {};

  if (results) {
    res.message = "";

    results.map(function (result) {
      if (result >= input.numberDayMinimum) {
        res.message += result.name + ' : à partir de ' + result.detail + '\n';
      }
    });
  }

  callback(null, res);
} 