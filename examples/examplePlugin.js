module.exports = function() {
	return {
		_plugin: "examplePlugin",
		ping: {
			modifier: "!",
			ignorePm: false,
			onlyPm: true,
			callback: function(bot, args) {
				bot.send("pong");
			}
		},
		echo: {
			modifier: "!",
			ignorePm: true,
			ignore: ["#spammyChannel1", "annoyingUser1"],
			callback: function(bot, args) {
				bot.send(args.join(" "));
			}
		}
	};
};