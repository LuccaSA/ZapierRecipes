// Fichier de demande de requêtes

var request = function (curDay, ignoreLeave) {

    var result = [];
    fetch(input.url + '&date=' + curDay.todayS + '&fields=isAM,leavePeriod[owner.name,owner.department,endsOn,endsAM]', {
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
                    leave: userleave,
                    departmentName: leave.leavePeriod.owner.department.name
                });
            }
            if (leave.isAM) {
                userleave.morning = true;
            } else {
                userleave.afternoon = true;
            }
        }

        // Créé les messages de sortie pour chacun des absents

        for (var i = 0; i < result.length; i++) {
            var curRes = result[i];
            var endSp = curRes.leave.end.split('-');
            var endSpDate = new Date(endSp[0], endSp[1] - 1, endSp[2]);
            var numberDay = parseInt(dayDiff(curDay.date, endSpDate)) + 1;

            if (curRes.leave.morning && curRes.leave.afternoon) {
                curRes.detail = curDay.formatString;
            } else if (curRes.leave.morning) {
                curRes.detail = curDay.formatString + ' matin';
            } else {
                curRes.detail = curDay.formatString + ' après-midi';
            }

            if (curRes.leave.end !== curRes.todayS) {
                curRes.detail += ' pendant ' + numberDay + ' jours';
                curRes.numberDay = numberDay;
            }
            else {
                curRes.numberDay = 0;
            }
        }
        sendResult(result, ignoreLeave);
    }).catch(function (error) {
        console.log(error);
    });
}