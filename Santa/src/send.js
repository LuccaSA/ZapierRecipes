var sendIssueToJira = function (summary, userId, linkList) {
  var fetch = require('node-fetch');

  var url = 'https://lucca.slack.com/api/users.info';
  var token = slackToken;

  url += '?token=' + token;
  url += '&user=' + userId;

  fetch(url).then(function (result) {
    return result.json();
  }).then(function (data) {
    var userName = data.user.real_name || data.user.name;
    var userEmail = data.user.profile.email || '';

    createJiraIssue(summary + '  ' + userName + '  <' + userEmail + '>', linkList);
  }).catch(function (error) {
    console.log('SEND :: ');
    console.log(error);
  })
};
