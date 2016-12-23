var createJiraIssue = function (summary, linkList) {
  var fetch = require('node-fetch');

  var identifiantEncode = jiraToken;
  var url = 'https://luccasoftware.atlassian.net/rest/api/2/issue'

  if (linkList !== undefined) {
    var linkDescription = linkList.join('\n');
  }

  fetch(url, {
    'method': 'POST',
    'headers': {
      'Authorization': 'Basic ' + identifiantEncode,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'fields': {
        'project': {
          'id': jiraProjectId
        },
        'summary': summary,
        'issuetype': {
          'id': 10001
        },
        'customfield_10004': 'FF-231',
        'description': linkDescription

      }
    })
  }).then(function (result) {
    return result.json();
  }).then(function (data) {
    console.log(data);
  }).catch(function (error) {
    console.log(error);
  });
};
