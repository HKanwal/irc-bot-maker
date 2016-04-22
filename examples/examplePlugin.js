module.exports = function() {
	return {
		_plugin: "examplePlugin",
		ping: {
			modifier: "!",
			callback: function(bot, args) {
				bot.send("pong");
			}
		},
		echo: {
			modifier: "!",
			callback: function(bot, args) {
				bot.send(args.join(" "));
			}
		}
	};
};