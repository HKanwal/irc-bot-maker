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
 * Tell bot to use a plugin. Must be before connecting
 * @param {Object} commands The object returned by plugin modules
 */
IRCBot.prototype.use = function(commands) {
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
 * Tell bot to stop using a plugin
 * @param {String} plugin The name of the plugin to stop using
 */
 IRCBot.prototype.unuse = function(plugin) {
 	if(this.plugins.indexOf(plugin) < 0) {
 		return;
 	}

 	for(var command in this.commands) {
 		if(this.commands[command].plugin == plugin) {
 			delete this.commands[command];
 		}
 	}
 	this.plugins.splice(this.plugins.indexOf(plugin), 1);
 };

/**
 * Connect to IRC and expose client API
 * @param {String} server Server to connect to
 * @param {Object} options Configuration options, optional
 */
IRCBot.prototype.connect = function(server, options) {
	this.client = new irc.Client(server, this.nick, options);
	self = this;

	this.client.addListener("message", function(from, to, text) {
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
			
			if(command.command == self.message.args[0]) {

				//Checks for 'ignorePm' and 'onlyPm'
				if(self.message.isPm) {
					if(command.disablePm || command.ignorePm) {
						return;
					}
				} else if(command.onlyPm) {
					return;
				}

				//Checks for 'ignore'
				if(command.ignore) {
					for(var ignoree in command.ignore) {
						ignoree = command.ignore[ignoree];

						if(ignoree[0] == "#") {
							if(!self.message.isPm && ignoree == to) {
								return;
							}
						} else {
							if(ignoree == from) {
								return;
							}
						}
					}
				}

				return command.callback(self, self.message.args.slice(1));
			}
		}
	});

	this.client.addListener("error", function(error) {
		console.log(error);
	});
};

/**
 * Send message to channel message is from or user in case of a personal message
 * @param {String} message Message to say
 * @param {Boolean} ignorePm Do not reply when presonal messaged
 * @param {Array} to Message recipient override, optional
 */
IRCBot.prototype.send = function(message, ignorePm, to) {
	if(to) {
		for(var recipient in to) {
			this.client.say(to[recipient], message);
		}
		return;
	}

	if(this.message.isPm) {
		if(ignorePm) {
			return;
		} else {
			this.client.say(this.message.from, message);
		}
	} else {
		this.client.say(this.message.to, message);
	}
};

/**
 * Disconnects from currently connected server
 * @param {String} message Message to send when disconnecting
 * @param {Function} callback Called when disconnected
 */
IRCBot.prototype.disconnect = function(message, callback) {
	this.client.disconnect(message, callback);
};

module.exports = IRCBot;