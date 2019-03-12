#!/usr/bin/node
const Discord = require("discord.js");
const client = new Discord.Client();
let pendu = require("./pendu.js");

// Get authentication data
let AuthDetails = require("./auth.json");



const commandPrefix = '!';

// Register our event handlers (defined below):
var CooldownManager = {
    cooldownTime: 8000, // 8 seconds
    store: {
        '?pendu': 1543848572,
        '?devine': 1543848572,
        '?alcool': 1543848572
    },

    canUse: function (commandName) {
        // Check if the last time you've used the command + 8 seconds has passed
        // (because the value is less then the current time)
        return this.store[commandName] + this.cooldownTime < Date.now();
    },

    touch: function (commandName) {
        // Store the current timestamp in the store based on the current commandName
        this.store[commandName] = Date.now();
    }
};

client.on('message', msg => {
    if (msg.author.username === "KedriBot") {
        return;
    }
    let VoHiYo = client.emojis.find(emoji => emoji.name === "VoHiYo");
    let POGGERS = client.emojis.find(emoji => emoji.name === "POGGERS");
    let cmonBruh = client.emojis.find(emoji => emoji.name === "cmonBruh");
    let FeelsBaguetteMan = client.emojis.find(emoji => emoji.name === "FeelsBaguetteMan");
    let emojis = [VoHiYo, POGGERS, cmonBruh, FeelsBaguetteMan];
    if (msg.content.indexOf('!alcool') > -1) {
        if (CooldownManager.canUse('!alcool')) {
            CooldownManager.touch('!alcool');
        } else {
            return;
        }
    }

    if (msg.content === commandPrefix + "alcool") {
        msg.channel.send(emojis[0] + " <http://www.alcool-info-service.fr/> ");
    }

    pendu.pendu(msg, emojis, CooldownManager, commandPrefix);
    
});

client.login(AuthDetails.token);
