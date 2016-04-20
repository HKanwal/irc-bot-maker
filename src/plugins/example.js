module.exports = function() {
	return {
		_plugin: "example",
		echo: {
			modifier: "!",
			callback: function(bot, args) {
				bot.send(args.join(" "));
			}
		}
	};
};