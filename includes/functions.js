module.exports = {
	isCommand: function (message, commandPrefix, commandsList) {
		for(const cmd of commandsList) {
			if (message.split(' ')[0] === commandPrefix + cmd) {
				return true;
			}
		}
		return false;
	},
	setCooldown: function (message, cooldownManager) {
		if (cooldownManager.canUse(message.split(' ')[0])) {
			cooldownManager.touch(message.split(' ')[0]);
		} else {
			return;
		}
	}
};

