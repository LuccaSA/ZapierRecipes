var sendAbsentOnLuccaFormDateToSlack = function (date, luccaToken, callback, slack) {
  var fetch = require('node-fetch');
  var request_url = 'https://lucca.ilucca.net/api/leaves?fields=owner.name&date=';

  fetch(request_url + date, {
    'headers': {
      'Authorization': 'lucca application=' + luccaToken
    }
  })
  .then(res => res.json())
  .then(data => callback(data, slack))
  .catch(error => console.log(error));
}
