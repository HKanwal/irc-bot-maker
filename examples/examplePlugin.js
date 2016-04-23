module.exports = function() {
	return {
		_plugin: "examplePlugin",
		ping: {
			modifier: "!",
			disablePm: false,
			callback: function(bot, args) {
				bot.send("pong");
			}
		},
		echo: {
			modifier: "!",
			disablePm: true,
			callback: function(bot, args) {
				bot.send(args.join(" "));
			}
		}
	};
};