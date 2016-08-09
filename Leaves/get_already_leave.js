var getAlreadyLeave = function () {
  input.ignoreLeave = [];

  if (!input || !input.offsetDays || input.offsetDays <= 0) {
    request(nextDay);
  }

  else {
    var date = new Date();
    var dateYear = '' + date.getFullYear(),
      dateMonth = date.getMonth() + 1,
      dateRealMonth = dateMonth > 9 ? '' + dateMonth : '0' + dateMonth,
      dateDay = date.getDate() > 9 ? '' + date.getDate() : '0' + date.getDate(),
      dateFormat = dateYear + '-' + dateRealMonth + '-' + dateDay;

    fetch(input.url + '&date=' + dateFormat + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]', {
      'headers': {
        'Authorization': 'lucca application=' + input.appToken
      }
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      var leaves = data.data.items;

      for (var i = 0; i < leaves.length; i++) {
        if (!checkIsIn(input.ignoreLeave, leaves[i].leavePeriod.owner.name)) {
          input.ignoreLeave.push(leaves[i].leavePeriod.owner.name);
        }
      }

      request(nextDay);
    }).catch(function (error) {
      console.log(error);
    });
  }
}