var nextDay = getNextWorkingDate(input.offsetDays);

// Permet de lancer le script une fois quand les variables existent

if (input && nextDay) {
  if (input.offsetDays === undefined || input.offsetDays < 0) {
    input.offsetDays = 0;
  }

  if (input.numberDayMinimum === undefined || input.offsetDays < 0) {
    input.offsetDays = 0;
  }

  request(nextDay);
}


