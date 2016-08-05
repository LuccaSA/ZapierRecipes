// Fichier d'initialisation des variables de date.

var getNextWorkingDate = function (offsetDate) {
    // Création de toutes les variables pour la date.

    var today = new Date();
    var curDay = {};

    // On regarde non pas aujourd'hui mais demain.
    today.setDate(today.getDate() + offsetDate);

    // Si la date tombe un dimanche on va jusqu'au lundi. (Il faudra aussi changer les messages d'erreur.)

    var array = {
        'Mon': 'lundi',
        'Tue': 'mardi',
        'Wed': 'mercredi',
        'Thu': 'jeudi',
        'Fri': 'vendredi',
        'Sat': 'samedi',
        'Sun': 'dimanche'
    };

    var when = 'demain';
    var move = 0;

    if (today.toDateString().split(' ')[0] === 'Sat' || today.toDateString().split(' ')[0] === 'Sun') {
        move = 2;
    }

    // Initialisation des variables de date avec les bonnes valeurs.

    today.setDate(today.getDate() + move);

    when = array[today.toDateString().split(' ')[0]];
    curDay.date = today;
    curDay.yearS = '' + today.getFullYear();
    curDay.month = today.getMonth() + 1;
    curDay.monthS = curDay.month > 9 ? '' + curDay.month : '0' + curDay.month;
    curDay.dayS = today.getDate() > 9 ? '' + today.getDate() : '0' + today.getDate();
    curDay.todayS = curDay.yearS + '-' + curDay.monthS + '-' + curDay.dayS;

    var res = [when, curDay];
    return (res);
};

module.exports = getNextWorkingDate;