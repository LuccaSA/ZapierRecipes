var sendIssueToJira = function (summary, userId, linkList) {
  var fetch = require('node-fetch');

  var url = 'https://slack.com/api/users.info';
  var token = process.env.token;

  url += '?token=' + token;
  url += '&user=' + userId;

  fetch(url).then(function (result) {
    return result.json();
  }).then(function (data) {
    var userName = data.user.real_name || data.user.name;
    var userEmail = data.user.profile.email || '';

    createJiraIssue(summary + '  ' + userName + '  <' + userEmail + '>', linkList);
  }).catch(function (error) {
    console.log(error);
  })
};
