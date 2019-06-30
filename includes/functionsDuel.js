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
  getCharFromAPI: function(charName, callback) {
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
    R : Récupérer le personnage de l'utilisateur en base + avec l'API
    E : ID de l'utilisateur
    S : objet CharFromAPI
    */
  getChar: function(authorId, callback) {
    let sql = "SELECT * FROM linkedChar WHERE idDiscord=?";
    connection.query(sql, authorId, (err, res) => {
      if (typeof res[0] != "undefined") {
        this.getCharFromAPI(
          res[0].charName + "-" + res[0].charRealm,
          charObj => {
            return callback(charObj);
          }
        );
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
  linkChar: function(fullCharName, authorId, callback) {
    this.getCharFromAPI(fullCharName, charObj => {
      let sql = "SELECT * FROM linkedChar WHERE idDiscord=?";
      connection.query(sql, authorId, (err, res) => {
        if (typeof res[0] != "undefined")
          return callback("Vous avez déjà un personnage de lié.");

        if (charObj.name === "") {
          return callback("Personnage non trouvé. Vérifiez la commande.");
        } else {
          sql =
            "INSERT INTO linkedChar (idDiscord, charName, charRealm, charClass) VALUES (?, ?, ?, ?)";
          connection.query(
            sql,
            [authorId, charObj.name, charObj.server, charObj.class],
            err => {
              if (err) console.log(err);
              return callback(
                "Vous avez lié votre profil Discord à votre personnage " +
                  fullCharName
              );
            }
          );
        }
      });
    });
  },

  /*
    Fonction getArmorType
    R : Récupère le type d'armure du personnage dans la BDD selon la classe
    E : La classe du personnage
    S : Le type d'armure
    */
  getArmorType: function(charClass, callback) {
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
  fleeAway: function(classFlee, callback) {
    let flee = Math.floor(Math.random() * Math.floor(100));
    
    if (flee < 15) {
      let sql = "SELECT phrase FROM fleeCatchPhrases WHERE classId=?";
      connection.query(sql, [classFlee], (err, res) => {
        if (err) console.log(err);
        if (typeof res[0] != "undefined") {
          return callback(res[0].phrase);
        }
      });
    }
  },

  /*
    Fonction winMessage
    R : Récupère un message de victoire aléatoire et le formate
    E : Noms des participants
    S : Message textuel
    */
  winMessage: function(winner, looser, callback) {
    let sql = "SELECT COUNT(phrase) FROM winPhrases";
    let message = "";
    connection.query(sql, (err, res) => {
      if (err) console.log(err);
      if (typeof res != "undefined") {
        sql = "SELECT phrase FROM winPhrases WHERE id=?";
        let rand = Math.floor(
          Math.random() * Math.floor(res[0]["COUNT(phrase)"]+1)
        );
        if(rand === 0) {
            rand = 1;
        }
        connection.query(sql, [rand], (err, res) => {
          if (err) console.log(err);
          if (typeof res != "undefined") {
            message = res[0].phrase.replace("{X}", winner);
            message = message.replace("{Y}", looser);
            return callback(message);
          }
        });
      }
    });
  }
};
