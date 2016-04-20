var irc = require("irc");

/**
 * IRC Bot core
 * @constructor
 * @param {String} nick Nickname to use
 */
function IRCBot(nick) {
	this.commands = {};
	this.nick = nick;
}

/**
 * Tell bot to use a plugin
 * @param {Object} commands The object returned by plugin modules
 */
IRCBot.prototype.use = function(commands) {
	var plugin = commands._plugin;
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

	this.listen("message", function(from, to, text) {
		this.message = {
			from: from,
			to: to,
			text: text,
			args: text.split(" ")
		};

		for(var command in this.commands) {
			//TODO: Make this clearer?
			if(this.commands[command].command == this.message.args[0]) {
				return this.commands[command].callback(this, this.message.args.slice(1));
			}
		}
	});

	this.listen("error", function(error) {
		console.log(error);
	});
};

/**
 * Shorthand for this.client.addListener
 * @param {String} event Event to listen for
 * @param {Function} callback Called when event is triggered
 */
IRCBot.prototype.listen = function(event, callback) {
	this.client.addListener(event, callback);
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

	if(this.message.to == this.nick) {
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