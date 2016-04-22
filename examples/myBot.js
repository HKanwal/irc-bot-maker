var IRCBot = require("irc-bot-maker");
var myBot = new IRCBot("myBot");

var examplePlugin = require("./examplePlugin");
myBot.use(examplePlugin());

myBot.connect("irc.freenode.net", {
	channels: ["#myChannel1", "#myChannel2"]
});