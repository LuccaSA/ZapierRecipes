// Fichier de demande de requêtes

var request = function (functionCall, curDay) {

    var result = [];
    fetch(input.url + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,endsOn,endsAM]', {
        'headers': {
            'Authorization': 'lucca application=' + input.appToken
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

            for (var i = 0; i < result.length; i++) {
                var curRes = result[i];

                if (curRes.detail === undefined) {
                    if (curRes.leave.morning && curRes.leave.afternoon) {
                        curRes.detail = curDay.formatString + ' toute la journée';
                    } else if (curRes.leave.morning) {
                        curRes.detail = curDay.formatString + ' matin';
                    } else {
                        curRes.detail = curDay.formatString + ' après-midi';
                    }

                    if (curRes.leave.end !== curDay.todayS) {
                        var endSp = curRes.leave.end.split('-');
                        var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
                        var numberDay = dayDiff(curDay.date, endSpDate);

                        if (numberDay >= 0 && numberDay >= input.numberDayMinimum) {
                            curRes.detail += ' et pendant ' + numberDay + ' jour(s)';
                        }
                        if (numberDay < input.numberDayMinimum) {
                            result.splice(i, 1);
                            i--;
                        }
                    }
                }
            }

            var messageSend = '';

            if (result.length === 0) {
                messageSend += 'Personne ne sera absent ' + getDayString(today);
            }

            // Attention: la vérification avec le tableau des absents du jours n'a ici pas été encore mise en place

            for (var i = 0; i < result.length; i++) {
                messageSend += result[i].name + ' sera absent(e) ' + result[i].detail + '\n';
            }

            var resultSend = {
                message: messageSend
            };

            functionCall(null, resultSend);
        }).catch(function (error) {
            console.log(error);
        });
}