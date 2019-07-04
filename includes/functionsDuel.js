let connection = require("./dbHandler.js");
let AuthDetails = require("./auth.json");
const blizzard = require("blizzard.js").initialize({
  key: AuthDetails.blizzardClientId,
  secret: AuthDetails.blizzardClientSecret
});

module.exports = {
  /*
    Fonction getCharFromAPI
    R : Récupère le personnage sur l'API WoW dont le Pseudo-Serveur est passé en paramètre
    E : Nom du personnage, serveur du personnage
    S : un objet
    */
  getCharFromAPI: function (charName, callback) {
    let char = charName.split("-")[0];
    let server = charName.split("-")[1];

    blizzard.getApplicationToken().then(response => {
      blizzard.defaults.token = response.data.access_token;
      blizzard.wow
        .character(["items"], {
          origin: "eu",
          realm: server.toLowerCase(),
          name: char.toLowerCase(),
          locale: "fr_FR"
        })
        .then(response => {
          let charReturn = {
            class: response.data.class,
            level: response.data.level,
            ilvl: response.data.items.averageItemLevel,
            server: response.data.realm,
            name: response.data.name
          };
          return callback(charReturn);
        })
        .catch(err => console.log(err));
    });
  },
  /*
    Fonction getChar
    R : Récupérer le personnage de l'utilisateur en base
    E : ID de l'utilisateur
    S : objet
    */
  getChar: function (authorId, callback) {
    let sql = "SELECT * FROM linkedChar WHERE idDiscord=? AND charName IS NOT NULL";
    connection.query(sql, authorId, (err, res) => {
      if (err) console.log(err);
      if (typeof res != "undefined") {
        let charReturn = {
          class: res[0].charClass,
          level: res[0].level,
          ilvl: res[0].ilvl,
          server: res[0].charRealm,
          name: res[0].charName,
          xp: res[0].xp,
          discLevel: res[0].discLevel
        };
        return callback(charReturn);
      }
      else {
        return callback(null);
      }
    });
  },
  /*
    Fonction getAllDbChar
    R : Récupérer tous les personnages en base
    E : Vide
    S : Tous les personnages de la bdd
    */
  getAllDbChar: function (callback) {
    let sql = "SELECT * FROM linkedChar WHERE charName IS NOT NULL";
    connection.query(sql, (err, res) => {
      if (err) console.log(err);
      if (typeof res[0] != "undefined") {
        return callback(res);
      }
      else {
        return callback(null);
      }
    });
  },
  /*
    Fonction linkChar
    R : Permet à un utilisateur de lier son personnage à son pseudo Discord en base
    E : Pseudo-Serveur en argument à la commande
    S : Vide
    */
  linkChar: function (fullCharName, authorId, callback) {
    this.getCharFromAPI(fullCharName, charObj => {
      if (charObj.name === "") {
        return callback("Personnage non trouvé. Vérifiez la commande.");
      }
      let sql = "SELECT * FROM linkedChar WHERE idDiscord=?";
      connection.query(sql, authorId, (err, res) => {
        if (err) console.log(err);
        if (typeof res[0] != "undefined" && res[0].charName != null) {
          return callback("Vous avez déjà un personnage de lié.");
        }
        //si présent en base on l'update
        else if (typeof res[0] != "undefined" && res[0].charName === null) {
          sql =
            "UPDATE linkedChar SET charName=?, charRealm=?, charClass=?, ilvl=?, level=? WHERE idDiscord=?";
          connection.query(
            sql,
            [charObj.name, charObj.server, charObj.class, charObj.ilvl, charObj.level, authorId],
            err => {
              if (err) console.log(err);
              return callback(
                "Vous avez lié votre profil Discord à votre personnage " +
                fullCharName
              );
            }
          );
        }

        //si non présent en base on l'ajoute
        sql =
          "INSERT INTO linkedChar (idDiscord, charName, charRealm, charClass, ilvl, level) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(
          sql,
          [authorId, charObj.name, charObj.server, charObj.class, charObj.ilvl, charObj.level],
          err => {
            if (err) console.log(err);
            return callback(
              "Vous avez lié votre profil Discord à votre personnage " +
              fullCharName
            );
          }
        );

      });
    });
  },

  /*
    Fonction getArmorType
    R : Récupère le type d'armure du personnage dans la BDD selon la classe
    E : La classe du personnage
    S : Le type d'armure
    */
  getArmorType: function (charClass, callback) {
    let sql = "SELECT at.typeName FROM classArmorType AS cat INNER JOIN armorType AS at ON cat.armorType = at.id WHERE cat.class=?";
    connection.query(sql, [charClass], (err, res) => {
      if (err) console.log(err);
      if (typeof res[0] != "undefined") {
        return callback(res[0]);
      }
    });
  },

  /*
    Fonction fleeAway
    R : Gère la fuite du duel en cas de malus
    E : Classes du fuyard
    S : Message textuel si il y a une fuite
    */
  fleeAway: function (classFlee, callback) {
    let sql = "SELECT phrase FROM fleeCatchPhrases WHERE classId=?";
    connection.query(sql, [classFlee], (err, res) => {
      if (err) console.log(err);
      if (typeof res[0] != "undefined") {
        return callback(res[0].phrase);
      }
    });
  },

  /*
    Fonction winMessage
    R : Récupère un message de victoire aléatoire et le formate
    E : Noms des participants
    S : Message textuel
    */
  winMessage: function (winner, looser, callback) {
    let sql = "SELECT COUNT(phrase) FROM winPhrases";
    let message = "";
    connection.query(sql, (err, res) => {
      if (err) console.log(err);
      if (typeof res != "undefined") {
        sql = "SELECT phrase FROM winPhrases WHERE id=?";
        let rand = Math.floor(
          Math.random() * Math.floor(res[0]["COUNT(phrase)"] + 1)
        );
        if (rand === 0) {
          rand = 1;
        }
        connection.query(sql, [rand], (err, res) => {
          if (err) console.log(err);
          if (typeof res != "undefined") {
            message = res[0].phrase.replace("{X}", "<@" + winner.idDiscord + "> (level " + winner.discLevel + ")");
            message = message.replace("{Y}", "<@" + looser.idDiscord + "> (level " + winner.discLevel + ")");
            return callback(message);
          }
        });
      }
    });
  },
  /*
   Fonction updateChar
   R : Met à jour le personnage lié a un participant du duel si besoin
   E : Noms des participants
   S : vide
   */
  updateChar: async function (authorId) {
    this.getChar(authorId, (charAuthor) => {
      if (null != charAuthor) {
        this.getCharFromAPI(charAuthor.name + "-" + charAuthor.server, (apiChar) => {
          if (null != apiChar && (charAuthor.ilvl != apiChar.ilvl || charAuthor.level != apiChar.level)) {
            let sql = "UPDATE linkedChar SET ilvl=?, level=? WHERE idDiscord=? AND charName IS NOT NULL";
            connection.query(sql, [apiChar.ilvl, apiChar.level, authorId], (err) => {
              if (err) console.log(err);
            });
          }
        });
      }
    });
  },
  /*
   Fonction unlinkChar
   R : Supprime le personnage lié à l'auteur de la commande !unlink
   E : id de l'utilisateur
   S : Message texte
   */
  unlinkChar: function (id, callback) {
    this.getChar(id, (res) => {
      if (null != res) {
        let sql = "UPDATE linkedChar SET charName=?, charRealm=?, charClass=?, ilvl=?, level=? WHERE idDiscord=?";
        connection.query(sql, [null, null, null, null, null, id], (err) => {
          if (err) console.log(err);
          return callback("Vous avez bien délié votre personnage.");
        });
      }
      else {
        return callback("Vous n'avez pas de personnage lié.")
      }
    })
  },
  /*
 Fonction manageXp
 R : Donne ou enlève de l'xp selon l'issue du duel
 E : id de l'utilisateur, montant d'xp
 S : Message texte
 */
  manageXp: function (id, xp) {
    this.getChar(id, (res) => {
      if (null != res) {
        let sql = "UPDATE linkedChar SET xp=? WHERE idDiscord=?";
        connection.query(sql, [res.xp + xp, id], (err) => {
          if (err) console.log(err);
        });
      }
    })
  },
  /*
Fonction getWinner
R : Récupère le gagnant du RoyalRumble
E : vide
S : le gagnant
*/
  getWinner: function (callback) {

    let sql = "SELECT * FROM linkedChar WHERE rumbleChamp=?";
    connection.query(sql, [true], (err, res) => {
      if (err) console.log(err);
      if (typeof res[0] != 'undefined') {
        return callback(res[0]);
      }
    });

  },
  /*
Fonction setRRWinner
R : Met en gagnant l'utilisateur voulu et enlève le flag de l'ancien gagnant
E : Les ID du nouveau et de l'ancien gagnant
S : vide
*/
  setRRWinner: function (idNew, idOld) {

    let sql = "UPDATE linkedChar SET rumbleChamp=? WHERE idDiscord=?";
    connection.query(sql, [true, idNew], (err) => {
      if (err) console.log(err);
      sql = "UPDATE linkedChar SET rumbleChamp=? WHERE idDiscord=?";
      connection.query(sql, [false, idOld], (err) => {
        if (err) console.log(err);

      });
    });

  },
  /*
Fonction levelUp
R : Met en gagnant l'utilisateur voulu et enlève le flag de l'ancien gagnant
E : Les ID du nouveau et de l'ancien gagnant
S : vide
*/
  levelUp: function (char) {

    let sql = "UPDATE linkedChar SET discLevel=?, xp=? WHERE idDiscord=?";
    connection.query(sql, [char.discLevel + 1, 0, char.idDiscord], (err) => {
      if (err) console.log(err);
    });

  },
};
