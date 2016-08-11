// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var sendResult = function (results) {
  var res = {};

  if (results !== undefined) {
    res.message = "";

    for (var i = 0; i < results.length; i++) {
      if (results[i].numberDay >= input.numberDayMinimum) {
        res.message += results[i].name + ' : à partir de ' + results[i].detail + '\n';
      }
    }
  }

  callback(null, res);
} 