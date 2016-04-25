# irc-bot-maker
A NodeJS irc bot framework that focuses on plugin based command sets and on the easy creation of your own commands.

## Installation
```
$ npm install irc-bot-maker
```

## Features
- Use and stop using plugins dynamically without having to disconect.
- Creating your own plugins is simple.
- Connect to multiple channels at once.
- Lightweight, only having a single dependency.

## Usage
To create a simple bot that uses the "examplePlugin" plugin:
```js  
var IRCBot = require("irc-bot-maker");
var myBot = new IRCBot("myBot");

var examplePlugin = require("./examplePlugin");
myBot.use(examplePlugin());

myBot.connect("myServer.com", {
	channels: ["#myChannel1", "#myChannel2"]
});
```  
You can .use() new plugins even after connecting so order doesn't matter.  

Here is the "examplePlugin" that has defines a "ping" and an "echo" command:
```js
module.exports = function() {
	return {
		_plugin: "examplePlugin",
		ping: {
			modifier: "!",
			ignorePm: false,
			callback: function(bot, args) {
				bot.send("pong");
			}
		},
		echo: {
			modifier: "!",
			ignorePm: true,
			callback: function(bot, args) {
				bot.send(args.join(" "));
			}
		}
	};
};
```  
This bot will now listen in chat for "!ping" and "!echo 'text'". Support for more command properties is coming soon.

## API
### IRCBot(nick)
The bot constructor takes the bot's nickname (required). To create a new instance simply:
```js
var IRCBot = require("irc-bot-maker");
var myBot = new IRCBot("myBot");
```

### .use(plugin)
Tell the bot to use a plugin. The plugin param is the returned object from a plugin containing its commands. If you want to use a plugin with a file name of "examplePlugin.js":
```js
var examplePlugin = require("./examplePlugin");
myBot.use(examplePlugin());
```

### .unuse(plugin)
Tell bot to stop using a plugin. The string param is the name of the plugin that is defined by its _plugin property.
```js
myBot.unuse("examplePlugin");
```

### .connect(server, options)
Connect to a server. [The possible options that can be passed into the options object can be found here.](https://node-irc.readthedocs.org/en/latest/API.html#client)
If you wanted to connect to the server myServer.com to channels myChannel1 and myChannel2:
```js
myBot.connect("myServer.com", {
	channels: ["#myChannel1", "#myChannel2"]
});
```

### .disconnect([message[, callback]])
Disconnects from current server. Message will be sent when disconnecting. If message is a function it will be considered the callback instead.

### .send(message[, ignorePm[, to]])
Sends a message to the current channel. The current channel would be the one the last message came from. Optionally you can only send it when it isn't a private message.
```js
myBot.send("This is a message.", true);
```  
This will not send the message if the last message was a PM to the bot.  
The third param is an array that manually defines the message recipients. Channel names start with a # and are otherwise considered users.
```js
myBot.send("This is a message.", false, ["user1", "#channel1", "user2", "#channel2"]);
```  
This message will be sent to two user: user1 and user2, and to two channels: #channel1 and #channel2

### .plugins
An array listing all of the plugins currently being used by the bot.

### .nick
The nickname being used by the bot. Changing this property will not alter it's nickname.

### .client
This object is the interface returned by the [node irc](https://www.npmjs.com/package/irc) module. It contains the core capabilities of the bot and 
[is well documented here.](https://node-irc.readthedocs.org/en/latest/)

## Creating Plugins
Plugins need to return an object with an _plugin property which gives the name of the plugin. All other properties are commands which can be executed. These commands are objects
containing the following properties.

### modifier
The modifier is what must be before the actual command name for the callback to be called.
```js
ping: {
	modifier: "!",
	callback: function(bot, args) {
		bot.send("pong");
	}
}
```  
This will listen for the "!ping" command. Modifier are not restricted to a single character.
```js
ping: {
	modifier: "",
	callback: function(bot, args) {
		bot.send("pong");
	}
}
```
This will listen for just a "ping" command.
```js
ping: {
	modifier: "!?$",
	callback: function(bot, args) {
		bot.send("pong");
	}
}
```
This will listen for a "!?$ping" command.

### ignorePm
Tell the bot not to execute a command if it is a private message. If unspecified or set to false, it will respond to commands that are private messaged to it by private
messaging the return value back. Also, this is an alias for the disablePm property.

### onlyPm
If true, that command will only be executed if it is send via private message.

### ignore
An array containing users or channels that will not trigger this command. Channels start with # and are otherwise considered users.

### callback(bot, args)
This will be triggered once the command is used. The bot param that is passed in is the instance of your bot. You can use any of the instance methods and any changes to the bot
that is passed in will also alter your instance.  

The second param args is an array with the args used when the command was called.
```
!echo I'm a bot
```  
Using this command in IRC will pass the following args to the callback function:
```
=> ["I'm", "a", "bot"]
```

## License
MIT