var nextDay = getNextWorkingDate(input.offsetDays);

// Permet de lancer le script une fois quand les variables existent

if (input && nextDay) {
  getAlreadyLeave(nextDay);
}


