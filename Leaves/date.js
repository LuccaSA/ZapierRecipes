// Fichier d'initialisation des variables de date.

var getNextDate = function() {
    // Création de toutes les variables pour la date.

    var today = new Date();
    var curDay = {};

    // On regarde non pas aujourd'hui mais demain.
    today.setDate(today.getDate() + 1);

    // Si la date tombe un dimanche on va jusqu'au lundi. (Il faudra aussi changer les messages d'erreur.)

    var when = 'demain';
    var move = 0;

    if (today.toDateString().split(' ')[0] === 'Sat') {
        move = 2;
        when = 'lundi';
    }
    if (today.toDateString().split(' ')[0] === 'Sun') {
        move = 1;
        when = 'lundi';
    }

    // Initialisation des variables de date avec les bonnes valeurs.

    today.setDate(today.getDate() + move);

    curDay.yearS = '' + today.getFullYear();
    curDay.month = today.getMonth() + 1;
    curDay.monthS = curDay.month > 9 ? '' + curDay.month : '0' + curDay.month;
    curDay.dayS = today.getDate() > 9 ? '' + today.getDate() : '0' + today.getDate();
    curDay.todayS = curDay.yearS + '-' + curDay.monthS + '-' + curDay.dayS;

    var res = [when, curDay];
    return (res);
};