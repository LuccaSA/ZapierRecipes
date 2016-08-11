// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var sendResult = function (result) {
  var res = {};

  if (result !== undefined) {
    res.message = "";

    for (var i = 0; i < result.length; i++) {
      if (result[i].numberDay >= input.numberDayMinimum) {
        res.message += result[i].name + ' : à partir de ' + result[i].detail + '\n';
      }
    }
  }

  callback(null, res);
} 