var answerToSlackUser = function(data, slack) {
  var data = data.data;
  var responseMessage = "";
  var usersName = [];

  if (data) {
    responseMessage += data.length > 0 ? data.length : "aucun";
    responseMessage += data.length > 1 ? " absents" : " absent";
    if (data.length >= 1) {
      responseMessage += ": "
    }
    data.map(leave => usersName.push(leave.owner.name));
    responseMessage += usersName.join(", ") + ".";
    slack.bot.reply(slack.message, responseMessage);
  }
};
