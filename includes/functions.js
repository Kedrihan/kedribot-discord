module.exports = {
	isCommand: function (message, commandPrefix, commandsList) {
		for(const cmd of commandsList) {
			if (message.indexOf(commandPrefix + cmd) > -1) {
				return true;
			}
		}
		return false;
	},
	setCooldown: function (message, cooldownManager) {
		if (cooldownManager.canUse(message.split(' ')[0])) {
			cooldownManager.touch(message.split(' ')[0]);
			return true;
		} else {
			return false;
		}
	}
};

