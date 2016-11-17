var token = process.env.token;
//////////////////////////////////////

(function () {
    var fetch = require('node-fetch');
    var RtmClient = require('@slack/client').RtmClient;
    var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

    var rtm = new RtmClient(token);
    rtm.start();

    var callback = function (error, success) {
        console.log(success);
    }

    var hueController = {}

    hueController.url = process.env.url;

    hueController.sendRequest = function (url, init) {
        fetch(url, init)
            .catch(function (error) { console.log(error); });
    }

    hueController.sendRequest(hueController.url, { method: 'PUT', body: JSON.stringify({ xy:[0.3, 0.3] , bri: 254 }) });

    hueController.setEffect = function (effect) {
        var init = {
            method: 'PUT',
            body: JSON.stringify({
                effect: effect
            })
        };
        this.sendRequest(this.url, init);
    }

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        if (message.channel === process.env.channel) {
            hueController.setEffect('colorloop');
            setTimeout(function () { hueController.setEffect('none'); }, 20000);
        }
    });

})();
