// Fichier de demande de requêtes

var request = function (curDay) {

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
                var endSp = curRes.leave.end.split('-');
                var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
                var numberDay = dayDiff(curDay.date, endSpDate);

                if (curRes.leave.morning && curRes.leave.afternoon) {
                    curRes.detail = curDay.formatString;
                } else if (curRes.leave.morning) {
                    curRes.detail = curDay.formatString + ' matin';
                } else if (curRes.leave.afternoon){
                    curRes.detail = curDay.formatString + ' après-midi';
                } else {
                    curRes.detail = curDay.formatString;
                }

                if (curRes.leave.end !== curRes.todayS) {
                    curRes.detail += ' pendant ' + numberDay + ' jours';
                    curRes.numberDay = numberDay;
                }
                else {
                    curRes.numberDay = '0';
                }
            }

            var messageSend = '';

            if (result.length === 0) {
                messageSend += 'Personne ne sera absent ' + curDay.formatString;
            }

            // Attention: la vérification avec le tableau des absents du jours n'a ici pas été encore mise en place

            for (var i = 0; i < result.length; i++) {
                if (result[i].numberDay >= input.numberDayMinimum) {
                    messageSend += result[i].name + ' : à partir de ' + result[i].detail + '\n';
                }
            }

            var resultSend = {
                message: messageSend
            };

            callback(null, resultSend);
        }).catch(function (error) {
            console.log(error);
        });
}