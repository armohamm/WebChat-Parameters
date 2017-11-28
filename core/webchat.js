var WebChat = function(params) {
    var user = {
        id: params['userId'] || 'userId',
        name: params["username"] || 'username'
    };

    var bot = {
        id: params['botId'] || 'botId',
        name: params["botName"] || 'botName'
    };

    // Create Directline connection and application
    var botConnection = new window.BotChat.DirectLine({
        secret: params['secret'],
        webSocket: params['webSocket'] && params['webSocket'] === "true" // defaults to true
    });

    window.BotChat.App({
        botConnection: botConnection,
        user: user,
        bot: bot
    }, document.getElementById(params['targetElement']));

    this.loadApplication = function() {
        /**
         * Sends custom parameter to the chatbot 
         **/
        var event = {
            type: "event",
            value: params['myCustomArg'],
            from: {
                id: params['userId']
            },
            name: "customArgName"
        };

        var sendCustomArg = function() {
            botConnection.postActivity(event).subscribe();
        }

        sendCustomArg();

        /**
         * When window unloads send endOfConversation 
         * This event is catched by the bot that can freeup server resources
         **/
        window.onbeforeunload = function() {
            var event = {
                type: "endOfConversation",
                from: {
                    id: params['userId']
                }
            };

            botConnection.postActivity(event).subscribe();
        };
    };

    return this;
};
