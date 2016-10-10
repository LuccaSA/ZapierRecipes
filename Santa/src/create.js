var createJiraIssue = function (summary, linkList) {
  var fetch = require('node-fetch');

  var identifiantEncode = process.env.identifiantEncode;
  var url = 'https://domain.atlassian.net/rest/api/2/issue'

  var linkDescription = linkList.join('\n');

  fetch(url, {
    'method': 'POST',
    'headers': {
      'Authorization': 'Basic ' + identifiantEncode,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'fields': {
        'project': {
          'id': 10200
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
}
