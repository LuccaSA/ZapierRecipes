// Fichier de demande de requêtes

var fetch = require('node-fetch');

function dayDiff(d1, d2) {
    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    return new Number(d2 - d1).toFixed(0);
}

var checkIsIn = function (result, name) {
    for (var i = 0; i < result.length; i++) {
        if (result[i].name === name)
            return (true);
    }
    return (false);
}

function request(result, functionCall, urlBase, curDay, appToken, when) {
    fetch(urlBase + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]', {
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
                    if (!checkIsIn(result, username)) {
                        result.push({
                            name: username,
                            leave: userleave
                        });
                    }
                }
                if (leave.isAM) {
                    userleave.morning = true;
                } else {
                    userleave.afternoon = true;
                }
            }

            if (result.lenght !== 0) {
                for (var i = 0; i < result.length; i++) {
                    var curRes = result[i];
                    var whenMsg = when + ' ' + curDay.dayS + '/' + curDay.monthS;

                    if (curRes.leave.morning && curRes.leave.afternoon) {
                        curRes.detail = whenMsg + ' toute la journée';
                    } else if (curRes.leave.morning) {
                        curRes.detail = whenMsg + ' matin';
                    } else {
                        curRes.detail = whenMsg + ' après-midi';
                    }

                    if (curRes.leave.end !== curDay.todayS) {
                        var endSp = curRes.leave.end.split('-');
                        var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
                        var numberDay = dayDiff(curDay.date, endSpDate);

                        if (numberDay >= 0) {
                            curRes.detail += ' et pendant ' + numberDay + ' jour(s)';
                        }
                    }
                }
            }
            else {
                result.push({
                    name: 'Personne n\'',
                    detail: when
                });
            }
            functionCall(null, result);
        }).catch(function (error) {
            console.log(error);
        });
}

module.exports = request;