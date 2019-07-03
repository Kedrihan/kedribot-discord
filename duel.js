var exports = (module.exports = {});
const func = require("./includes/functionsDuel.js");
let percentWinAuthor = 50;
let royalrumbleNumber = 0;
exports.duel = async function (
  msg,
  emojis,
  commandPrefix,
  serverMembers
) {
  try {
    if (msg.channel.name === "botcommands") {
      if (
        msg.content.split(" ")[0] === commandPrefix + "link" &&
        msg.content.split(" ")[1].length != 0
      ) {
        func.linkChar(msg.content.split(" ")[1], msg.author.id, message => {
          msg.channel.send(message);
        });
      }
      if (msg.content === commandPrefix + "unlink") {
        func.unlinkChar(msg.author.id, message => {
          msg.channel.send(message);
        })
      }
    }
    if (msg.channel.name === "duel") {
      if (msg.content === commandPrefix + "royalrumble") {
        func.getAllDbChar(allChars => {
          let first = null;
          let second = null;
          let third = null;
          let total = allChars.length;
          while (first == null || second == null || third == null) {
            let rd = Math.floor(Math.random() * allChars.length - 1);
            first = allChars[rd];
            allChars.splice(rd, 1);
            rd = Math.floor(Math.random() * allChars.length - 1);
            second = allChars[rd];
            allChars.splice(rd, 1);
            rd = Math.floor(Math.random() * allChars.length - 1);
            third = allChars[rd];
            allChars.splice(rd, 1);
          }
          msg.channel.send("Top 3 de ce Royal Rumble Edition #" + royalrumbleNumber + " by KedriBot (avec " + total + " participant(s)) : ")
          msg.channel.send("1er : " + first.charName + "-" + first.charRealm);
          msg.channel.send("2eme : " + second.charName + "-" + second.charRealm);
          msg.channel.send("3eme : " + third.charName + "-" + third.charRealm);
          royalrumbleNumber++;

        });
        return;
      }
      if (
        msg.content.split(" ")[0] === commandPrefix + "duel" &&
        msg.content.split(" ")[1].match(/[\\<>@!\d]/g)
      ) {
        percentWinAuthor = 50;
        let target = msg.content.split(" ")[1];
        let targetId = target.replace(/[\\<>@!]/g, "");
        let randEmoji = Math.floor(Math.random() * emojis.length)
        if (randEmoji === 4 || randEmoji == null) {
          randEmoji = 3;
        }
        let emojiToSend = emojis[randEmoji];
        if (randEmoji === 4 || emojiToSend == null) {
          emojiToSend = emojis[5];
        }
        if ((targetId === "252187834616774656" && msg.author.id === "288659667268141056") || (targetId === "288659667268141056" && msg.author.id === "252187834616774656")) {
          msg.channel.send("La bromance entre " + msg.author.toString() + " et <@" + targetId + "> est trop puissante, le duel est annulé !");
          return;
        }
        if (targetId === msg.author.id) {
          msg.channel.send("Un peu de bon sens " + msg.author.toString() + " ! Tu ne peux pas te combattre toi-même !");
          return;
        }
        if (serverMembers.get(targetId) != undefined) {
          await func.updateChar(msg.author.id);
          await func.updateChar(targetId);
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
                    if (authorChar.ilvl > opponentChar.ilvl) {
                      percentWinAuthor += diffIlvl;
                    } else {
                      percentWinAuthor -= diffIlvl;
                    }

                    let flee = Math.floor(Math.random() * Math.floor(100));
                    if (flee < 15) {
                      if (armorAuthor != null && armorOpponent != null) {
                        switch (armorAuthor.typeName) {
                          case "T":
                            if (armorOpponent.typeName === "C") {
                              func.fleeAway(authorChar.class, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });

                            } else if (armorOpponent.typeName === "P") {
                              func.fleeAway(opponentChar.class, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "C":
                            if (armorOpponent.typeName === "M") {
                              func.fleeAway(authorChar.class, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "T") {
                              func.fleeAway(opponentChar.class, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "M":
                            if (armorOpponent.typeName === "P") {
                              func.fleeAway(authorChar.class, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "C") {
                              func.fleeAway(opponentChar.class, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "P":
                            if (armorOpponent.typeName === "T") {
                              func.fleeAway(authorChar.class, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "M") {
                              func.fleeAway(opponentChar.class, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                        }
                      }
                    }
                    else {

                      let win = Math.floor(Math.random() * Math.floor(100));
                      if (win < percentWinAuthor) {
                        //Win de l'auteur
                        func.winMessage(
                          msg.author.toString(),
                          target,
                          message => {
                            msg.channel.send(message + " " + emojiToSend);
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
                            msg.channel.send(message + " " + emojiToSend);
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
                          " ! " + emojiToSend
                        );
                        return;
                      }
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
                      msg.channel.send(message + " " + emojiToSend);
                    }
                  );
                } else if (win > 50) {
                  //win de l'opposant
                  func.winMessage(
                    "<@" + targetId + ">",
                    msg.author.toString(),
                    message => {
                      msg.channel.send(message + " " + emojiToSend);
                    }
                  );
                } else {
                  //égalité
                  msg.channel.send(
                    "C'est une étonnante égalité entre " +
                    msg.author.toString() +
                    " et " +
                    "<@" +
                    targetId +
                    ">" +
                    " ! " + emojiToSend
                  );
                }
                return;
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
  }
  catch (err) {
    console.error(err)
  }
};
