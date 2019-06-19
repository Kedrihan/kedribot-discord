let connection = require("./dbHandler.js");

module.exports = {
    /*
    Fonction GetAuthorChar
    R : Récupérer le personnage de l'auteur de la commande !duel (récupération pseudo en base + appel de la fonction GetCharFromAPI)
    E : pseudo de l'auteur de la commande
    S : objet du personnage
    */
    getAuthorChar: function(authorUsername) {

    },

    /*
    Fonction DuelStart
    R : Lance le duel et envoi le résultat sur le canal Discord
    E : 2 objets de personnage
    S : Vide
    */
    duelStart: function(authorChar, opponentChar) {

    },
    /*
    Fonction LinkChar
    R : Permet à un utilisateur de lier son personnage à son pseudo Discord en base
    E : Pseudo-Serveur en argument à la commande
    S : Vide
    */
    linkChar: function(fullCharName) {

    },
};