var irc = require("irc");

/**
 * IRC Bot core
 * @constructor
 * @param {String} nick Nickname to use
 */
function IRCBot(nick) {
	this.commands = {};
	this.plugins = [];
	this.nick = nick;
}

/**
 * Tell bot to use a plugin
 * @param {Object} commands The object returned by plugin modules
 */
IRCBot.prototype.use = function(commands) {
	if(this.client) {
		return;
	}

	var plugin = commands._plugin;
	this.plugins.push(plugin);
	delete commands._plugin;

	for(var command in commands) {
		var modifier = commands[command].modifier || "";

		this.commands[command] = commands[command];
		this.commands[command].plugin = plugin;
		this.commands[command].command = modifier + command;
	}
};

/**
 * Connect to IRC and expose client API
 * @param {String} server Server to connect to
 * @param {Object} options Configuration options, optional
 */
IRCBot.prototype.connect = function(server, options) {
	this.client = new irc.Client(server, this.nick, options);
	var self = this;

	self.client.addListener("message", function(from, to, text) {
		self.message = {
			from: from,
			to: to,
			text: text,
			args: text.split(" ")
		};

		if(to[0] != "#" && to.indexOf(self.nick) >= 0) {
			self.message.isPm = true;
		} else {
			self.message.isPm = false;
		}

		for(var command in self.commands) {
			command = self.commands[command];
			
			//TODO: Make this clearer?
			if(command.command == self.message.args[0]) {
				if(command.disablePm && self.message.isPm) {
					return;
				}

				return command.callback(self, self.message.args.slice(1));
			}
		}
	});

	self.client.addListener("error", function(error) {
		console.log(error);
	});
};

/**
 * Send message to channel message is from or user in case of a personal message
 * @param {String} message Message to say
 * @param {Boolean} disablePm Do not reply when presonal messaged
 * @param {Array} to Message recipient override, optional
 */
IRCBot.prototype.send = function(message, disablePm, to) {
	if(to) {
		for(var recipient in to) {
			this.client.say(to[recipient], message);
		}
		return;
	}

	if(this.message.isPm) {
		if(disablePm) {
			return;
		} else {
			this.client.say(this.message.from, message);
		}
	} else {
		this.client.say(this.message.to, message);
	}
};

module.exports = IRCBot;