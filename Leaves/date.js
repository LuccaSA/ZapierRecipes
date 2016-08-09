// Fichier d'initialisation des variables de date.

var getNextWorkingDate = function (offsetDays) {

    // Création de toutes les variables pour la date.

    if (!offsetDays) {
        return null;
    }

    var day = new Date();
    var nextDay = {};

    for (var i = 0; i < offsetDays; i++) {
        day.setDate(day.getDate() + 1);
        if (day.toDateString().split(' ')[0] === 'Sat' || day.toDateString().split(' ')[0] === 'Sun') {
            day.setDate(day.getDate() + 2);
        }
    }

    var array = {
        'Mon': 'lundi',
        'Tue': 'mardi',
        'Wed': 'mercredi',
        'Thu': 'jeudi',
        'Fri': 'vendredi',
        'Sat': 'samedi',
        'Sun': 'dimanche'
    };

    nextDay.date = day;
    nextDay.yearS = '' + day.getFullYear();
    nextDay.month = day.getMonth() + 1;
    nextDay.monthS = nextDay.month > 9 ? '' + nextDay.month : '0' + nextDay.month;
    nextDay.dayS = day.getDate() > 9 ? '' + day.getDate() : '0' + day.getDate();
    nextDay.todayS = nextDay.yearS + '-' + nextDay.monthS + '-' + nextDay.dayS;
    nextDay.formatString = array[day.toDateString().split(' ')[0]];
    return nextDay;
};
