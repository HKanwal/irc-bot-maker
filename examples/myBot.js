var IRCBot = require("irc-bot-maker");
var myBot = new IRCBot("myBot");

var examplePlugin = require("./examplePlugin");
myBot.use(examplePlugin());

myBot.connect("myServer.com", {
	channels: ["#myChannel1", "#myChannel2"]
});