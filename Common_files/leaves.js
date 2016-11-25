// Si la variable input existe vérifie les valeur de offsetDays et la valeur de numberDayMinimum

if (input) {
  if (input.offsetDays === undefined || input.offsetDays < 0) {
    input.offsetDays = 0;
  }

  if (input.numberDayMinimum === undefined || input.numberDayMinimum < 0) {
    input.numberDayMinimum = 0;
  }

  // Puis initialise la variable nextDay avec la prochainne date prise en compte
  var nextDay = getNextWorkingDate(input.offsetDays);

  // Et enfin lance la requête
  request(nextDay);
}