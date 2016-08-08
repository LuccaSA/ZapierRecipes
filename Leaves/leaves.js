// Fonction qui permet à partir du paramètre params de retourner l'url qui sera utilisé.

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

var nextDay = getNextWorkingDate(input.offsetDays);
var urlBase = input.url;
var appToken = input.appToken;

console.log(urlBase + '&date=' + nextDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]');

// On lance la recherche pour J+1

request(callback, nextDay);
