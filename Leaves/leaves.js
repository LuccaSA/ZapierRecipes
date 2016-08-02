var fetch = require('node-fetch');

var callback = function (error, success) {
	 console.log(success);
};
var today = new Date();
var yearS = '' + today.getFullYear();
var month = today.getMonth() + 1;
var monthS = month > 9 ? '' + month : '0' + month;
var dayS = today.getDate() > 9 ? '' + today.getDate() : '0' + today.getDate();
var todayS = yearS + '-' + monthS + '-' + dayS;
var urlBase = 'https://lucca.ilucca.net/api/v3/leaves?leavePeriod.ownerId=greaterthan,0'
var appToken = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
console.log(urlBase + '&date=' + todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]');
fetch(urlBase + '&date=' + todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]', {
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
      if (curRes.leave.morning && result[i].leave.afternoon) {
        curRes.detail = 'toute la journée';
      } else if (curRes.leave.morning) {
        curRes.detail = 'ce matin';
      } else {
        curRes.detail = 'cet après-midi';
      }
      if (curRes.leave.end !== todayS) {
        var endSp = curRes.leave.end.split('-');
        curRes.detail += ' et jusqu\'au ' + endSp[2] + '/' + endSp[1] + '/' + endSp[0] + ' inclus';
      }
    }
    if (result.length === 0) {
      result.push({
        name: 'Personne n\'',
        detail: 'aujourd\'hui'
      });
    }
    callback(null, result);
  }).catch(function (error) {
    console.log(error);
  });