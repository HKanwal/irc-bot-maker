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