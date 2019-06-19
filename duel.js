var exports = module.exports = {};
const func = require("./includes/functionsDuel.js");
const funcGlobal = require("./includes/functions.js");

exports.duel = function(msg, emojis, cooldownManager, commandPrefix, client, commandsList) {

    if (msg.channel.name === "duel") {

        if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
            funcGlobal.setCooldown(msg.content, cooldownManager);
        }





    }
}