let connection = require("./dbHandler.js");



module.exports = {
    CharFromAPI = {
        class: '',
        level: '',
        ilvl: '',
        server: '',
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
    linkChar: function (fullCharName) {

    },

    /*
    Fonction getCharFromAPI
    R : Récupère le personnage sur l'API WoW dont le Pseudo-Serveur est passé en paramètre
    E : Nom du personnage, serveur du personnage
    S : un objet CharFromAPI
    */
    getCharFromAPI: function (charName) {

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