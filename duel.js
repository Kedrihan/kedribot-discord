var exports = (module.exports = {});
const func = require("./includes/functionsDuel.js");
const funcGlobal = require("./includes/functions.js");
let percentWinAuthor = 50;
exports.duel = function(
  msg,
  emojis,
  cooldownManager,
  commandPrefix,
  client,
  commandsList,
  serverMembers
) {
  if (msg.channel.name === "botcommands") {
    if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
      funcGlobal.setCooldown(msg.content, cooldownManager);
    }
    if (
      msg.content.split(" ")[0] === commandPrefix + "link" &&
      msg.content.split(" ")[1].length != 0
    ) {
      func.linkChar(msg.content.split(" ")[1], msg.author.id, message => {
        msg.channel.send(message);
      });
    }
  }
  if (msg.channel.name === "duel") {
    if (funcGlobal.isCommand(msg.content, commandPrefix, commandsList)) {
      funcGlobal.setCooldown(msg.content, cooldownManager);
    }
    if (
      msg.content.split(" ")[0] === commandPrefix + "duel" &&
      msg.content.split(" ")[1].match(/[\\<>@!\d]/g)
    ) {
      percentWinAuthor = 50;
      let target = msg.content.split(" ")[1];
      let targetId = target.replace(/[\\<>@!]/g, "");

      if (serverMembers.get(targetId) != undefined) {
        func.getChar(targetId, opponentChar => {
          func.getChar(msg.author.id, authorChar => {
            if (
              authorChar != null &&
              opponentChar != null &&
              authorChar.level === opponentChar.level
            ) {
              func.getArmorType(authorChar.class, armorAuthor => {
                func.getArmorType(opponentChar.class, armorOpponent => {
                  let diffIlvl = Math.ceil(
                    Math.abs(authorChar.ilvl - opponentChar.ilvl) / 2
                  );
                  console.log("diff ilvl = "+diffIlvl);
                  if (authorChar.ilvl > opponentChar.ilvl) {
                    percentWinAuthor -= diffIlvl;
                  } else {
                    percentWinAuthor += diffIlvl;
                  }
                  console.log("%win = "+percentWinAuthor)
                  if (armorAuthor != null && armorOpponent != null) {
                    switch (armorAuthor.typeName) {
                      case "T":
                        if (armorOpponent.typeName === "C") {
                          func.fleeAway(authorChar.class, message => {
                            message = message.replace("{X}", msg.author.toString());
                            message = message.replace("{Y}", target);
                            msg.channel.send(message);
                            return;
                          });
                          
                        } else if (armorOpponent.typeName === "P") {
                          func.fleeAway(opponentChar.class, message => {
                            message = message.replace("{X}", target);
                            message = message.replace("{Y}", msg.author.toString());
                            msg.channel.send(message);
                            return;
                          });
                        }
                        break;
                      case "C":
                        if (armorOpponent.typeName === "M") {
                          func.fleeAway(authorChar.class, message => {
                            message = message.replace("{X}", msg.author.toString());
                            message = message.replace("{Y}", target);
                            msg.channel.send(message);
                            return;
                          });
                        } else if (armorOpponent.typeName === "T") {
                          func.fleeAway(opponentChar.class, message => {
                            message = message.replace("{X}", target);
                            message = message.replace("{Y}", msg.author.toString());
                            msg.channel.send(message);
                            return;
                          });
                        }
                        break;
                      case "M":
                        if (armorOpponent.typeName === "P") {
                          func.fleeAway(authorChar.class, message => {
                            message = message.replace("{X}", msg.author.toString());
                            message = message.replace("{Y}", target);
                            msg.channel.send(message);
                            return;
                          });
                        } else if (armorOpponent.typeName === "C") {
                          func.fleeAway(opponentChar.class, message => {
                            message = message.replace("{X}", target);
                            message = message.replace("{Y}", msg.author.toString());
                            msg.channel.send(message);
                            return;
                          });
                        }
                        break;
                      case "P":
                        if (armorOpponent.typeName === "T") {
                          func.fleeAway(authorChar.class, message => {
                            message = message.replace("{X}", msg.author.toString());
                            message = message.replace("{Y}", target);
                            msg.channel.send(message);
                            return;
                          });
                        } else if (armorOpponent.typeName === "M") {
                          func.fleeAway(opponentChar.class, message => {
                            message = message.replace("{X}", target);
                            message = message.replace("{Y}", msg.author.toString());
                            msg.channel.send(message);
                            return;
                          });
                        }
                        break;
                    }
                  }

                  let win = Math.floor(Math.random() * Math.floor(100));
                  console.log("win = "+win)
                  if (win < percentWinAuthor) {
                    //Win de l'auteur
                    func.winMessage(
                        msg.author.toString(),
                        target,
                      message => {
                        msg.channel.send(message);
                        msg.channel.send(
                          "(" +
                            msg.author.toString() +
                            " avait " +
                            percentWinAuthor +
                            "% de chances de l'emporter.)"
                        );
                      }
                    );
                    return;
                  } else if (win > percentWinAuthor) {
                    //win de l'opposant
                    func.winMessage(
                      target,
                      msg.author.toString(),
                      message => {
                        msg.channel.send(message);
                        msg.channel.send(
                          "(" +
                            msg.author.toString() +
                            " avait " +
                            percentWinAuthor +
                            "% de chances de l'emporter.)"
                        );
                      }
                    );
                    return;
                  } else {
                    //égalité
                    msg.channel.send(
                      "C'est une étonnante égalité entre " +
                      msg.author.toString() +
                        " et " +
                        target +
                        " ! :o"
                    );
                    msg.channel.send(
                      "(Ils avaient chacun" +
                        percentWinAuthor +
                        "% de chances de l'emporter.)"
                    );
                    return;
                  }
                });
              });
            } else {
              //Faire duel 100% random si l'auteur de la commande n'a pas de perso link OU que l'utilisateur tag en paramètre n'en a pas OU que les persos n'ont pas le même level
              let win = Math.floor(Math.random() * Math.floor(100));
              if (win < 50) {
                //Win de l'auteur
                func.winMessage(
                  msg.author.toString(),
                  "<@" + targetId + ">",
                  message => {
                    msg.channel.send(message);
                  }
                );
                return;
              } else if (win > 50) {
                //win de l'opposant
                func.winMessage(
                  "<@" + targetId + ">",
                  msg.author.toString(),
                  message => {
                    msg.channel.send(message);
                  }
                );
                return;
              } else {
                //égalité
                msg.channel.send(
                  "C'est une étonnante égalité entre " +
                    msg.author.toString() +
                    " et " +
                    "<@" +
                    targetId +
                    ">" +
                    " ! :o"
                );
                return;
              }
            }
          });
        });
      } else {
        msg.channel.send(
          "L'utilisateur ciblé n'est pas sur le serveur Discord."
        );
        return;
      }
    }
  }
};
