// Fichier de demande de requêtes

var request = function (thisDay) {

    var results = [];
    fetch(input.url + '&date=' + thisDay.todayS + '&fields=isAM,leavePeriod[owner.name,owner.department,endsOn,endsAM,startsOn]', {
        'headers': {
            'Authorization': 'lucca application=' + input.appToken
        }
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        console.log(data);
        var leaves = data.data.items;
        var hash = {};

        // Liste tous les absents à J+input.offsetDays

        leaves.map(function (leave) {
            var username = leave.leavePeriod.owner.name;
            var userleave = hash[username];
            if (!userleave) {
                userleave = {
                    morning: false,
                    afternoon: false,
                    end: leave.leavePeriod.endsOn.split('T')[0]
                };
                hash[username] = userleave;
                console.log(leave.leavePeriod.startsOn.split('T')[0]);
                if (leave.leavePeriod.startsOn.split('T')[0] === thisDay.todayS) {
                    results.push({
                        name: username,
                        leave: userleave,
                        departmentName: leave.leavePeriod.owner.department.name,
                        departmentId: leave.leavePeriod.owner.department.id
                    });
                }
            }
            if (leave.isAM) {
                userleave.morning = true;
            } else {
                userleave.afternoon = true;
            }
        });

        // Créé les messages de sortie pour chacun des absents

        results.map(function (curRes) {
            var endSp = curRes.leave.end.split('-');
            var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
            var numberDay = parseInt(dayDiff(thisDay.date, endSpDate)) + 1;

            if (curRes.leave.morning && curRes.leave.afternoon) {
                curRes.detail = thisDay.formatString;
            } else if (curRes.leave.morning) {
                curRes.detail = thisDay.formatString + ' matin';
            } else {
                curRes.detail = thisDay.formatString + ' après-midi';
            }

            if (curRes.leave.end !== curRes.todayS && numberDay >= 2) {
                if (numberDay < 7) {
                    curRes.detail += ' pendant ' + numberDay;
                    curRes.detail += numberDay > 1 ? ' jours' : ' jour';
                }
                else {
                    var nbrWeek = (numberDay / 7) >> 0;
                    if (numberDay - nbrWeek * 7 > 0) {
                        nbrWeek += 1;
                    }

                    curRes.detail += ' pendant ' + nbrWeek;
                    curRes.detail += nbrWeek > 1 ? ' semaines' : ' semaine';
                }
                curRes.numberDay = numberDay;
            }
            else {
                curRes.numberDay = 0;
            }
        });

        sendResult(results);
    }).catch(function (error) {
        console.log(error);
    });
}