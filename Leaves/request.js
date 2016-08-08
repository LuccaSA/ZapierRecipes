// Fichier de demande de requêtes

var request = function (result, functionCall, urlBase, curDay, appToken, when, dayMinimum) {
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
            for (var i = 0; i < leaves.length; i++) {
                var leave = leaves[i];
                var username = leave.leavePeriod.owner.name;
                var userleave = hash[username];
                if (!checkIsIn(result, username)) {
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
            }

            if (result.lenght !== 0) {
                for (var i = 0; i < result.length; i++) {
                    var curRes = result[i];

                    if (curRes.detail === undefined) {
                        if (curRes.leave.morning && curRes.leave.afternoon) {
                            curRes.detail = when + ' toute la journée';
                        } else if (curRes.leave.morning) {
                            curRes.detail = when + ' matin';
                        } else {
                            curRes.detail = when + ' après-midi';
                        }

                        if (curRes.leave.end !== curDay.todayS) {
                            var endSp = curRes.leave.end.split('-');
                            var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
                            var numberDay = dayDiff(curDay.date, endSpDate);

                            if (numberDay >= 0 && numberDay >= dayMinimum) {
                                curRes.detail += ' et pendant ' + numberDay + ' jour(s)';
                            }
                            if (numberDay < dayMinimum) {
                                result.splice(i, 1);
                                i--;
                            }
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