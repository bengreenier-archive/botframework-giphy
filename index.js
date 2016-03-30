var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var morgan = require('morgan');

var server = restify.createServer();

var giphyBot = new builder.BotConnectorBot();

giphyBot.add('/', function (session) {
    var matched = /\/giphy\s(.+)/.exec(session.message.text);
    if (matched && matched.length > 0) {
        request("http://api.giphy.com/v1/gifs/search?q="+matched[1]+"&api_key=dc6zaTOxFJmzC&limit=1", function (err, res, body) {
            if (err) {
                session.error(err);
            } else {
                var url = JSON.parse(body).data[0].url;
                var msg = session.createMessage(url);
                
                session.send(msg);
            }
        });
    } else {
        //TODO: uncomment if we stop listening on all input
        //session.error(new Error("invalid input"));
    }
});

server.use(morgan("combined"));
server.use(giphyBot.verifyBotFramework({ appId: process.env.APP_ID, appSecret: process.env.APP_SECRET }));
server.post('/v1/messages', giphyBot.listen());

server.listen(process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url); 
});