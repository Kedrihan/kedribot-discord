var exports = module.exports = {};
const func = require("./includes/functionsDuel.js");
const funcGlobal = require("./includes/functions.js");
let percentWinAuthor = 50;

exports.duel = function (msg, emojis, cooldownManager, commandPrefix, client, commandsList, serverMembers) {

    if (msg.channel.name === "botcommands") {
        if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
            funcGlobal.setCooldown(msg.content, cooldownManager);
        }
        if (msg.content.split(' ')[0] === commandPrefix + "link" && msg.content.split(' ')[1].length != 0) {
            func.linkChar(msg.content.split(' ')[1])
                .then(message => {
                    msg.channel.send(message);
                });
        }
    }
    if (msg.channel.name === "duel") {

        if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
            funcGlobal.setCooldown(msg.content, cooldownManager);
        }
        if (msg.content.split(' ')[0] === commandPrefix + "duel" && msg.content.split(' ')[1].match(/[\\<>@!\d]/g)) {
            let targetId = msg.content.split(' ')[1].replace(/[\\<>@!]/g, "");
            let opponentChar = null;
            let authorChar = func.getChar(msg.author.id);
            if (serverMembers.get(targetId) != undefined) {
                opponentChar = func.getChar(targetId);
            }
            else {
                msg.channel.send("L'utilisateur ciblé n'est pas sur le serveur Discord.");
                return;
            }

            if (authorChar != null && opponentChar != null && authorChar.level === opponentChar.level) {

                let diffIlvl = Math.abs(authorChar.ilvl - opponentChar.ilvl);
                if (authorChar.ilvl > opponentChar.ilvl) {
                    percentWinAuthor -= diffIlvl;
                }
                else {
                    percentWinAuthor += diffIlvl;
                }

                let armorAuthor = null;
                func.getArmorType(authorChar.class, (res) => {
                    armorAuthor = res;
                });

                let armorOpponent = null;
                func.getArmorType(opponentChar.class, (res) => {
                    armorOpponent = res;
                });
                if (armorAuthor != null && armorOpponent != null) {
                    switch (armorAuthor) {
                        case 'T':
                            if (armorOpponent === 'C') {
                                func.fleeAway(authorChar.class, (message) => {
                                    message = message.replace('{X}', authorChar.name);
                                    message = message.replace('{Y}', opponentChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            else if (armorOpponent === 'P') {
                                func.fleeAway(opponentChar.class, (message) => {
                                    message = message.replace('{X}', opponentChar.name);
                                    message = message.replace('{Y}', authorChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            break;
                        case 'C':
                            if (armorOpponent === 'M') {
                                func.fleeAway(authorChar.class, (message) => {
                                    message = message.replace('{X}', authorChar.name);
                                    message = message.replace('{Y}', opponentChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            else if (armorOpponent === 'T') {
                                func.fleeAway(opponentChar.class, (message) => {
                                    message = message.replace('{X}', opponentChar.name);
                                    message = message.replace('{Y}', authorChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            break;
                        case 'M':
                            if (armorOpponent === 'P') {
                                func.fleeAway(authorChar.class, (message) => {
                                    message = message.replace('{X}', authorChar.name);
                                    message = message.replace('{Y}', opponentChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            else if (armorOpponent === 'C') {
                                func.fleeAway(opponentChar.class, (message) => {
                                    message = message.replace('{X}', opponentChar.name);
                                    message = message.replace('{Y}', authorChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            break;
                        case 'P':
                            if (armorOpponent === 'T') {
                                func.fleeAway(authorChar.class, (message) => {
                                    message = message.replace('{X}', authorChar.name);
                                    message = message.replace('{Y}', opponentChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            else if (armorOpponent === 'M') {
                                func.fleeAway(opponentChar.class, (message) => {
                                    message = message.replace('{X}', opponentChar.name);
                                    message = message.replace('{Y}', authorChar.name);
                                    msg.channel.send(message);
                                    return;
                                });
                            }
                            break;
                    }
                }

                let win = Math.floor(Math.random() * Math.floor(100));
                if (win < percentWinAuthor) {
                    //Win de l'auteur
                    func.winMessage(authorChar.name, opponentChar.name, (message) => {
                        msg.channel.send(message);
                        msg.channel.send("("+msg.author.toString()+" avait "+percentWinAuthor+"% de chances de l'emporter.)");
                    });
                    return;
                }
                else if (win > percentWinAuthor) {
                    //win de l'opposant
                    func.winMessage(opponentChar.name, authorChar.name, (message) => {
                        msg.channel.send(message);
                        msg.channel.send("("+msg.author.toString()+" avait "+percentWinAuthor+"% de chances de l'emporter.)");
                    });
                    return;
                }
                else {
                    //égalité
                    msg.channel.send("C'est une étonnante égalité entre " + authorChar.name + " et " + opponentChar.name + " ! :o");
                    msg.channel.send("(Ils avaient chacun"+percentWinAuthor+"% de chances de l'emporter.)");
                    return;
                }


            }
            else {
                //Faire duel 100% random si l'auteur de la commande n'a pas de perso link OU que l'utilisateur tag en paramètre n'en a pas OU que les persos n'ont pas le même level
                let win = Math.floor(Math.random() * Math.floor(100));
                if (win < 50) {
                    //Win de l'auteur
                    func.winMessage(msg.author.toString(), "<@"+targetId+">", (message) => {
                        msg.channel.send(message);
                    });
                    return;
                }
                else if (win > 50) {
                    //win de l'opposant
                    func.winMessage("<@"+targetId+">", msg.author.toString(), (message) => {
                        msg.channel.send(message);
                    });
                    return;
                }
                else {
                    //égalité
                    msg.channel.send("C'est une étonnante égalité entre " + msg.author.toString() + " et " + "<@"+targetId+">" + " ! :o");
                    return;
                }
            }
        }
    }
}