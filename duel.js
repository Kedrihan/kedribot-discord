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
            let xpLvl = (100 * (char.discLevel + 1));
            msg.channel.send("Salut " + msg.author.toString() + ", tu es niveau " + char.discLevel + " avec " + char.xp + "/" + xpLvl + " points d'expérience, et ton personnage lié est " + char.name + "-" + char.server + ", bisou :)")
          }
          else {
            msg.channel.send("Vous n'avez pas lié de personnage :(")
          }
        });
        return;
      }
      if (msg.content === commandPrefix + "charslink") {
        func.getAllDbChar((chars) => {
          func.buildHtml(chars, serverMembers)
          let usernames = [];
          let winD = [];
          let loseD = [];
          let winRR = [];
          let fDuel = [];
          let dLvl = [];
          for (let i = 0; i < 5; i++) {
            if (chars[i].discLevel != 0) {
              let usr = serverMembers.get(chars[i].idDiscord);
              usernames.push(usr.user.username);
              winD.push(chars[i].winDuel);
              loseD.push(chars[i].losDuel);
              winRR.push(chars[i].winRR);
              fDuel.push(chars[i].nbFuites);
              dLvl.push(chars[i].discLevel);
            }
          }
          let maxUsrNme = Math.max(...(usernames.map(el => el.length)));
          let maxWinD = Math.max(winD).toString().length;
          let maxLosD = Math.max(loseD).toString().length;
          let maxWinRR = Math.max(winRR).toString().length;
          let maxDuelF = Math.max(fDuel).toString().length;
          let maxDLvl = Math.max(dLvl).toString().length;
          let nbrTUsr = func.getDashNumbers(maxUsrNme);
          let nbrTLvl = func.getDashNumbers(maxDLvl);
          let nbrTRR = func.getDashNumbers(maxWinRR);
          let nbrTW = func.getDashNumbers(maxWinD);
          let nbrTL = func.getDashNumbers(maxLosD);
          let nbrTF = func.getDashNumbers(maxDuelF);

          let message = "```";

          let titlePs = func.adaptCell(" Pseudo ", maxUsrNme)
          let titleLvl = func.adaptCell(" Niveau ", maxDLvl)
          let titleRR = func.adaptCell(" Victoires au RoyalRumble ", maxWinRR)
          let titleW = func.adaptCell(" Victoires Duel ", maxWinD)
          let titleL = func.adaptCell(" Défaites Duel ", maxLosD)
          let titleF = func.adaptCell(" Fuites Duel ", maxDuelF)

          if (maxUsrNme < titlePs.length - 2) {
            maxUsrNme = titlePs.length
            nbrTUsr = func.getDashNumbers(maxUsrNme);
            titlePs = func.adaptCell(" Pseudo ", maxUsrNme)
          }
          if (maxDLvl < titleLvl.length - 2) {
            maxDLvl = titleLvl.length
            nbrTLvl = func.getDashNumbers(maxDLvl);
            titleLvl = func.adaptCell(" Niveau ", maxDLvl)
          }
          if (maxWinRR < titleRR.length - 2) {
            maxWinRR = titleRR.length
            nbrTRR = func.getDashNumbers(maxWinRR);
            titleRR = func.adaptCell(" Victoires au RoyalRumble ", maxWinRR)
          }
          if (maxWinD < titleW.length - 2) {
            maxWinD = titleW.length
            nbrTW = func.getDashNumbers(maxWinD);
            titleW = func.adaptCell(" Victoires Duel ", maxWinD)
          }
          if (maxLosD < titleL.length - 2) {
            maxLosD = titleL.length
            nbrTL = func.getDashNumbers(maxLosD);
            titleL = func.adaptCell(" Défaites Duel ", maxLosD)
          }
          if (maxDuelF < titleF.length - 2) {
            maxDuelF = titleF.length
            nbrTF = func.getDashNumbers(maxDuelF);
            titleF = func.adaptCell(" Fuites Duel ", maxDuelF)
          }

          message = message.concat("\n", "+-" + nbrTUsr + "-+-" + nbrTLvl + "-+-" + nbrTRR + "-+-" + nbrTW + "-+-" + nbrTL + "-+-" + nbrTF + "-+\n|" + titlePs + "|" + titleLvl + "|" + titleRR + "|" + titleW + "|" + titleL + "|" + titleF + "|\n+-" + nbrTUsr + "-+-" + nbrTLvl + "-+-" + nbrTRR + "-+-" + nbrTW + "-+-" + nbrTL + "-+-" + nbrTF + "-+")

          for (let i = 0; i < 5; i++) {
            if (chars[i].discLevel != 0) {
              let usr = serverMembers.get(chars[i].idDiscord);

              let chmpUsrNme = " " + usr.user.username + " ";
              chmpUsrNme = func.adaptCell(chmpUsrNme, maxUsrNme)

              let chmpLvl = " " + chars[i].discLevel + " ";
              chmpLvl = func.adaptCell(chmpLvl, maxDLvl)

              let chmpWinRR = " " + chars[i].winRR + " ";
              chmpWinRR = func.adaptCell(chmpWinRR, maxWinRR)

              let chmpWinD = " " + chars[i].winDuel + " ";
              chmpWinD = func.adaptCell(chmpWinD, maxWinD)

              let chmpLoseD = " " + chars[i].losDuel + " ";
              chmpLoseD = func.adaptCell(chmpLoseD, maxLosD)

              let chmpDuelF = " " + chars[i].nbFuites + " ";
              chmpDuelF = func.adaptCell(chmpDuelF, maxDuelF)


              let ccat = "|" + chmpUsrNme + "|" + chmpLvl + "|" + chmpWinRR + "|" + chmpWinD + "|" + chmpLoseD + "|" + chmpDuelF + "|\n+-" + nbrTUsr + "-+-" + nbrTLvl + "-+-" + nbrTRR + "-+-" + nbrTW + "-+-" + nbrTL + "-+-" + nbrTF + "-+"
              message = message.concat("\n", ccat);
            }
          }
          message = message.concat(" ", "```");
          message = message.concat("\n", "__Note : sur ce tableau, uniquement les 5 premiers membres niveau 1 ou plus sont affichés.__")
          message = message.concat("\n", "Si vous ne pouvez pas voir ce tableau correctement ou que vous voulez consulter son intégralité, suivez ce lien pour le consulter en ligne : https://kedrihan.fr/charslink.html (il n'est pas mis à jour en temps réel)")
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
            let nextRR = new Date(CooldownManager.store["!royalrumble"] + 86400000);
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
                    if (authorChar.winnerRR) {
                      percentWinAuthor += 5
                    }
                    if (opponentChar.winnerRR) {
                      percentWinAuthor -= 5
                    }
                    let flee = Math.floor(Math.random() * Math.floor(100));
                    if (flee < 15) {
                      if (armorAuthor != null && armorOpponent != null) {
                        switch (armorAuthor.typeName) {
                          case "T":
                            if (armorOpponent.typeName === "C") {
                              func.fleeAway(authorChar, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });

                            } else if (armorOpponent.typeName === "P") {
                              func.fleeAway(opponentChar, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "C":
                            if (armorOpponent.typeName === "M") {
                              func.fleeAway(authorChar, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "T") {
                              func.fleeAway(opponentChar, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "M":
                            if (armorOpponent.typeName === "P") {
                              func.fleeAway(authorChar, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "C") {
                              func.fleeAway(opponentChar, message => {
                                message = message.replace("{X}", target);
                                message = message.replace("{Y}", msg.author.toString());
                                msg.channel.send(message + " ");
                                return;
                              });
                            }
                            break;
                          case "P":
                            if (armorOpponent.typeName === "T") {
                              func.fleeAway(authorChar, message => {
                                message = message.replace("{X}", msg.author.toString());
                                message = message.replace("{Y}", target);
                                msg.channel.send(message + " ");
                                return;
                              });
                            } else if (armorOpponent.typeName === "M") {
                              func.fleeAway(opponentChar, message => {
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
                      let xpTarget = 0
                      if (winBool && authorChar.discLevel <= opponentChar.discLevel) {
                        xp = 10
                        xpTarget = -2
                      }
                      else if (winBool && authorChar.discLevel > opponentChar.discLevel) {
                        xp = 5
                        xpTarget = -1
                      }
                      else if (!winBool && authorChar.discLevel <= opponentChar.discLevel) {
                        xp = -1
                        xpTarget = 5
                      }
                      else if (!winBool && authorChar.discLevel > opponentChar.discLevel) {
                        xp = -2
                        xpTarget = 10
                      }
                      let usr = serverMembers.get(opponentChar.idDiscord)
                      if (authorChar.xp + xp < (100 * (authorChar.discLevel + 1)) && opponentChar.xp + xpTarget < (100 * (opponentChar.discLevel + 1))) {
                        
                        
                        func.manageXp(authorChar.idDiscord, xp);
                        func.manageXp(opponentChar.idDiscord, xpTarget);
                        if (xp > 0) {
                          setTimeout(function () { msg.channel.send(msg.author.username + " a obtenu " + xp + " points d'expérience !") }, 500);
                        }
                        else {
                          setTimeout(function () { msg.channel.send(msg.author.username + " a perdu "+Math.abs(xp)+" point(s) d'expérience ! CHEH !") }, 500);
                        }

                        if (xpTarget > 0) {
                          setTimeout(function () { msg.channel.send(usr.user.username + " a obtenu " + xpTarget + " points d'expérience !") }, 500);
                        }
                        else {
                          setTimeout(function () { msg.channel.send(usr.user.username + " a perdu "+Math.abs(xpTarget)+" point(s) d'expérience ! CHEH !") }, 500);
                        }

                      }
                      else {
                        if (authorChar.xp + xp >= (100 * (authorChar.discLevel + 1))) {
                          func.levelUp(authorChar, (res) => {
                            if (res) {
                              func.manageXp(authorChar.idDiscord, authorChar.xp + xp - (100 * (authorChar.discLevel + 1)));
                              let newLvl = authorChar.discLevel + 1;

                              setTimeout(function () { msg.channel.send(msg.author.username + " a obtenu " + xp + " points d'expérience et est passé level " + newLvl + "!") }, 500);
                            }
                          });
                        }

                        if (opponentChar.xp + xpTarget >= (100 * (opponentChar.discLevel + 1))) {
                          func.levelUp(opponentChar, (res) => {
                            if (res) {
                              func.manageXp(opponentChar.idDiscord, opponentChar.xp + xpTarget - (100 * (opponentChar.discLevel + 1)));
                              let newLvl = opponentChar.discLevel + 1;
                              setTimeout(function () { msg.channel.send(usr.user.username + " a obtenu " + xpTarget + " points d'expérience et est passé level " + newLvl + "!") }, 500);
                            }
                          });
                        }


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
