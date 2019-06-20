let connection = require("./dbHandler.js");
let AuthDetails = require("./includes/auth.json");
const blizzard = require('blizzard.js').initialize({
    key: AuthDetails.blizzardClientId,
    secret: AuthDetails.blizzardClientSecret
});


module.exports = {
    CharFromAPI = {
        class: 0,
        level: 0,
        ilvl: 0,
        server: '',
        name: ''
    },
    /*
    Fonction getChar
    R : Récupérer le personnage de l'utilisateur en base
    E : ID de l'utilisateur
    S : objet CharFromAPI
    */
    getChar: function (authorId) {

    },

    /*
    Fonction linkChar
    R : Permet à un utilisateur de lier son personnage à son pseudo Discord en base
    E : Pseudo-Serveur en argument à la commande
    S : Vide
    */
    linkChar: function (fullCharName, authorId) {

        this.getCharFromAPI(fullCharName)
            .then(charObj => {
                if (charObj === null) {
                    //message d'erreur perso non trouvé
                }
                else {
                    let sql = "INSERT INTO linkedChar (idDiscord, charName, charRealm, charIlvl, charClass, charLevel) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [authorId, charObj.name, charObj.server, charObj.ilvl, charObj.class, charObj.level], (err) => {
                        if (err) console.log(err);
                    });
                }
            });

    },

    /*
    Fonction getCharFromAPI
    R : Récupère le personnage sur l'API WoW dont le Pseudo-Serveur est passé en paramètre
    E : Nom du personnage, serveur du personnage
    S : un objet CharFromAPI
    */
    getCharFromAPI: function (charName) {
        let char = charName.split('-')[0];
        let server = charName.split('-')[1];
        let charReturn = new this.CharFromAPI;
        blizzard.wow.character(['profile'], { origin: 'eu', realm: server.toLowerCase(), name: char.toLowerCase(), locale: 'fr_FR', fields: 'items' })
            .then(response => {
                charReturn.level = response.data.level;
                charReturn.ilvl = response.data.items.averageItemLevel;
                charReturn.server = response.data.realm;
                charReturn.name = response.data.name;
                charReturn.class = response.data.class;
                return charReturn;
            }); //faire un .then à l'appel de cette fonction
    },

    /*
    Fonction getArmorType
    R : Récupère le type d'armure du personnage dans la BDD selon la classe
    E : La classe du personnage
    S : Le type d'armure
    */
    getArmorType: function (charClass) {

    },
};