var messageService = function ($timeout) {

    var settings = {
        publish_key: 'pub-c-34d13177-c7ef-42cb-a475-6163ef5cf173',
        subscribe_key: 'sub-c-2495c260-990f-11e2-ac20-12313f022c90',
        channel: 'c1',
        waitForChannelMs: 100
    };

    var channelOpen = false;

    var pubnub = PUBNUB.init({
        publish_key: settings.publish_key,
        subscribe_key: settings.subscribe_key
    });

    var send = function (message) {
        (function waitForChannelOpenFn() {
            if (channelOpen) {
                pubnub.publish({
                    channel: settings.channel,
                    message: message
                })
            } else {
                $timeout(waitForChannelOpenFn, settings.waitForChannelMs);
            }
        })();
    };

    var listen = function (listener) {
        pubnub.subscribe({
            channel: settings.channel,
            message: function (msg) { listener(msg) },
            connect: function () { channelOpen = true; }
        })

    };

    return {
        send: send,
        listen: listen
    };
};