if (process.argv.length !== 4) {
  console.log('Usage: node src/main.js token_channel_slack id_channel');
  return;
}

var token = process.argv[2];
var channel = process.argv[3];
//////////////////////////////////////

var stopColorLoop = function (bridgeLocalIp) {
    const fetch = require('node-fetch');

    var url = 'http://' + bridgeLocalIp + '/api/ovpiVwMuf51lWFMh/groups/1/action';
    var body = { method: 'PUT', body: JSON.stringify({'effect': 'none'})};

    fetch(url, body).catch((error) => console.log(error));
};

var launchColorLoop = function (bridgeLocalIp) {
    const fetch = require('node-fetch');

    var url = 'http://' + bridgeLocalIp + '/api/ovpiVwMuf51lWFMh/groups/1/action';
    var body = { method: 'PUT', body: JSON.stringify({'effect': 'colorloop'})};

    fetch(url, body).then(function () {
        setTimeout(function () {
            stopColorLoop(bridgeLocalIp);
        }, 15000);
    }).catch((error) => console.log(error));
};

var launchSlackListerner = function (bridgeLocalIp) {
    const SlackBot = require('slackbots');

    // Create a bot
    var bot = new SlackBot({
        token: token
    });

    bot.on('message', function (data) {
        if (data !== undefined && data.channel === channel) {
            launchColorLoop(bridgeLocalIp);
        }
    });
};

var getBridgeLocalIp = function () {
    var fetch = require('node-fetch');

    fetch('https://www.meethue.com/api/nupnp')
        .then(result => result.json())
        .then(function (data) {
            if (data[0] !== undefined && data[0].internalipaddress !== undefined) {
                console.log('Launched on ' + data[0].internalipaddress + ' .');
                launchSlackListerner(data[0].internalipaddress);
            } else {
                console.log('Can not found any bridge. Please try in another network.');
            }
        })
        .catch(error => console.log(error));
};

(function () {
    getBridgeLocalIp();
})()
