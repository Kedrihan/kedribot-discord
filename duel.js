var exports = module.exports = {};
const func = require("./includes/functionsDuel.js");
const funcGlobal = require("./includes/functions.js");
let percentWinAuthor = 50;

exports.duel = function (msg, emojis, cooldownManager, commandPrefix, client, commandsList, serverMembers) {

    if (msg.channel.name === "duel") {

        if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
            funcGlobal.setCooldown(msg.content, cooldownManager);
        }
        if (msg.content.split(' ')[0] === commandPrefix + "duel" && msg.content.split(' ')[1].match(/[\\<>@!\d]/g)) {
            let targetId = msg.content.split(' ')[1].replace(/[\\<>@!]/g, "");

            let authorChar = func.getChar(msg.author.id);
            if (serverMembers.get(targetId) != undefined) {
                let opponentChar = func.getChar(targetId);
            }
            else {
                //User ciblé pas sur discord
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

                if (percentWinAuthor < 10) {
                    msg.channel.send(); //fuite auto de l'auteur
                    return;
                }
                else if (percentWinAuthor > 90) {
                    msg.channel.send(); //fuite auto de l'adversaire
                    return;
                }
                else {
                    let win = Math.floor(Math.random() * Math.floor(100));
                    if (win < percentWinAuthor) {
                        //Win de l'auteur
                        return;
                    }
                    else if (win > percentWinAuthor) {
                        //win de l'opposant
                        return;
                    }
                    else {
                        //égalité
                        return;
                    }
                }

            }
            else {
                //Faire duel 100% random si l'auteur de la commande n'a pas de perso link OU que l'utilisateur tag en paramètre n'en a pas OU que les persos n'ont pas le même level
            }
        }
        else {
            //ERREUR : commande non correcte ou pas une mention d'utilisateur comme argument
        }
    }
}