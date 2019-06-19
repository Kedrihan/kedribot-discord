let connection = require("./dbHandler.js");

var CharFromAPI = {
    class: '',
    level: '',
    ilvl: '',
    server: '',
};

module.exports = {
    /*
    Fonction getAuthorChar
    R : Récupérer le personnage de l'auteur de la commande !duel (récupération pseudo en base + appel de la fonction GetCharFromAPI)
    E : pseudo de l'auteur de la commande
    S : objet du personnage
    */
    getAuthorChar: function(authorUsername) {

    },

    /*
    Fonction duelStart
    R : Lance le duel et envoi le résultat sur le canal Discord
    E : 2 objets de personnage
    S : Vide
    */
    duelStart: function(authorChar, opponentChar) {

    },
    
    /*
    Fonction linkChar
    R : Permet à un utilisateur de lier son personnage à son pseudo Discord en base
    E : Pseudo-Serveur en argument à la commande
    S : Vide
    */
    linkChar: function(fullCharName) {

    },

    /*
    Fonction getCharFromAPI
    R : Récupère le personnage sur l'API WoW dont le Pseudo-Serveur est passé en paramètre
    E : Nom du personnage, serveur du personnage
    S : un objet CharFromAPI
    */
    getCharFromAPI: function(charName) {

    },

    /*
    Fonction getArmorType
    R : Récupère le type d'armure du personnage dans la BDD selon la classe
    E : La classe du personnage
    S : Le type d'armure
    */
    getArmorType: function(charClass) {

    },
};