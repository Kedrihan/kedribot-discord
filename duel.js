var exports = (module.exports = {});
const func = require("./includes/functionsDuel.js");
let percentWinAuthor = 50;
let royalrumbleNumber = 0;
exports.duel = async function (
  msg,
  emojis,
  commandPrefix,
  serverMembers,
  commandsList,
  CooldownManager
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
        return;
      }
      if (msg.content === commandPrefix + "unlink") {
        func.unlinkChar(msg.author.id, message => {
          msg.channel.send(message);
        })
        return;
      }
      if (msg.content === commandPrefix + "profile") {
        func.getChar(msg.author.id, (char) => {
          if (char != null && char.name != null) {
            msg.channel.send("Salut " + msg.author.toString() + ", tu es niveau " + char.discLevel + " avec " + char.xp + "/100 points d'expérience, et ton personnage lié est " + char.name + "-" + char.server + ", bisou :)")
          }
          else {
            msg.channel.send("Vous n'avez pas lié de personnage :(")
          }
        });
        return;
      }
      if (msg.content === commandPrefix + "charslink") {
        func.getAllDbChar((chars) => {
          let message = "```Liste des personnes ayant un personnage lié sur Discord : ";
          for (let i = 0; i < chars.length; i++) {
            let usr = serverMembers.get(chars[i].idDiscord);
            message = message.concat("\n", usr.user.username + " - niveau de duel : " + chars[i].discLevel);
          }
          message = message.concat(" ", "```");
          msg.channel.send(message);
        });
        return;
      }
    }
    if (msg.channel.name === "duel") {
      if (msg.content === commandPrefix + "royalrumble") {

        //Manage 24hours CD for RoyalRumble
        if (CooldownManager.canUseRR(commandPrefix + "royalrumble")) {
          CooldownManager.touch(commandPrefix + "royalrumble");
        }
        else {
          func.getWinner((champ) => {
            let nextRR = new Date(CooldownManager.store["!royalrumble"] + 871240000);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            msg.channel.send("Le(a) champion(ne) actuel(le) du Royal Rumble est <@" + champ.idDiscord + "> ! Vous pourrez en relancer un le " + nextRR.toLocaleDateString('fr-FR', options));
            return;
          })
          return;
        }

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

          let champion = serverMembers.get(first.idDiscord);
          func.getWinner((oldW) => {
            let old = serverMembers.get(oldW.idDiscord);
            old.removeRole("596313698751086592").catch(console.error);
            func.setRRWinner(first.idDiscord, oldW.idDiscord);
            champion.addRole("596313698751086592").catch(console.error)
            royalrumbleNumber++;
            msg.channel.send("<@" + first.idDiscord + "> devient le(a) nouveau(elle) champion(ne) du Royal Rumble pour 24 heures minimum ! " + emojis[1])
            return;
          });

        });
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
        if (targetId === "534293066731880458") {
          msg.channel.send("Cherche pas à me défier, je te bas dans tous les cas. (Et arrête de me tag stp " + emojis[3] + ")");
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
                      return;
                    }

                    let win = Math.floor(Math.random() * Math.floor(100));
                    let winBool = false;
                    if (win < percentWinAuthor) {
                      //Win de l'auteur
                      winBool = true;
                      func.winMessage(
                        authorChar,
                        opponentChar,
                        message => {
                          msg.channel.send(message + " " + emojiToSend + "(" + percentWinAuthor + "% de chances de win pour " + msg.author.toString() + ")");
                        }
                      );
                    } else if (win > percentWinAuthor) {
                      //win de l'opposant
                      winBool = false;
                      func.winMessage(
                        opponentChar,
                        authorChar,
                        message => {
                          msg.channel.send(message + " " + emojiToSend + "(" + percentWinAuthor + "% de chances de win pour " + msg.author.toString() + ")");
                        }
                      );
                    } else {
                      //égalité
                      winBool = null;
                      msg.channel.send(
                        "C'est une étonnante égalité entre " +
                        msg.author.toString() +
                        " et " +
                        target +
                        " ! " + emojiToSend
                      );
                    }
                    if (winBool != null) {
                      let xp = 0
                      if (winBool && authorChar.discLevel <= opponentChar.discLevel) {
                        xp = 10
                      }
                      else if (winBool && authorChar.discLevel > opponentChar.discLevel) {
                        xp = 5
                      }
                      else if (!winBool && authorChar.discLevel <= opponentChar.discLevel) {
                        xp = 3
                      }
                      else if (!winBool && authorChar.discLevel > opponentChar.discLevel) {
                        xp = -2
                      }

                      if (authorChar.xp + xp < 100) {

                        func.manageXp(authorChar.idDiscord, xp);
                        if (xp != -2) {
                          setTimeout(function () { msg.channel.send(msg.author.toString() + " a obtenu " + xp + " points d'expérience !") }, 1000);
                        }
                        else {
                          setTimeout(function () { msg.channel.send(msg.author.toString() + " a perdu 2 points d'expérience ! CHEH !") }, 1000);
                        }

                      }
                      else {
                        func.levelUp(authorChar, (res) => {
                          if (res) {
                            func.manageXp(authorChar.idDiscord, authorChar.xp + xp - 100);
                            let newLvl = authorChar.discLevel + 1;
                            msg.channel.send(msg.author.toString() + " a obtenu " + xp + " points d'expérience et est passé level " + newLvl + "!")
                          }
                        });

                      }

                    }


                    return;
                  });
                  return;
                });
                return;
              } else {
                //Faire duel 100% random si l'auteur de la commande n'a pas de perso link OU que l'utilisateur tag en paramètre n'en a pas OU que les persos n'ont pas le même level
                let win = Math.floor(Math.random() * Math.floor(100));
                if (win < 50) {
                  //Win de l'auteur
                  func.winMessageNoChar(
                    msg.author.toString(),
                    "<@" + targetId + ">",
                    message => {
                      msg.channel.send(message + " " + emojiToSend);
                    }
                  );
                } else if (win > 50) {
                  //win de l'opposant
                  func.winMessageNoChar(
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
