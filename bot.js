#!/usr/bin/node
const Discord = require("discord.js");
const client = new Discord.Client();
let pendu = require("./pendu.js");

// Get authentication data
let AuthDetails = require("./includes/auth.json");



const commandPrefix = '!';

// Register our event handlers (defined below):
var CooldownManager = {
    cooldownTime: 8000, // 8 seconds
    store: {
        '!pendu': 1543848572,
        '!devine': 1543848572,
        '!alcool': 1543848572,
        '!commu': 1543848572,
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
client.on('guildMemberAdd', member => {
	member.addRole("308398054023626752").catch(console.error);
});
client.on('guildMemberRemove', member => {
	pendu.removeUserRanking(member);
});
client.on('message', msg => {
    if (msg.author.username === "KedriBot") {
        return;
    }
    let VoHiYo = msg.guild.emojis.find(emoji => emoji.name === "VoHiYo");
    let POGGERS = msg.guild.emojis.find(emoji => emoji.name === "POGGERS");
    let cmonBruh = msg.guild.emojis.find(emoji => emoji.name === "cmonBruh");
    let FeelsBaguetteMan = msg.guild.emojis.find(emoji => emoji.name === "FeelsBaguetteMan");
    let Horde = msg.guild.emojis.find(emoji => emoji.name === "Horde");
    let emojis = [VoHiYo, POGGERS, cmonBruh, FeelsBaguetteMan, Horde];

    if (msg.content.indexOf(commandPrefix + "alcool") > -1 || msg.content.indexOf(commandPrefix + "jusdepomme") > -1) {
        if (CooldownManager.canUse(commandPrefix + "alcool")) {
            CooldownManager.touch(commandPrefix + "alcool");
        } else {
            return;
        }
    }
    if (msg.content === commandPrefix + "alcool" || msg.content === commandPrefix + "jusdepomme") {
        msg.channel.send(emojis[0] + " <http://www.alcool-info-service.fr/> ");
    }
    if (msg.content === commandPrefix + "commu") {
        msg.channel.send(emojis[0] + " <https://worldofwarcraft.com/fr-fr/invite/r9mGL2HbXZ?region=EU&faction=Horde> "+emojis[4]);
    }
    pendu.pendu(msg, emojis, CooldownManager, commandPrefix, client);
    
});

client.login(AuthDetails.token).catch((err) => {
    console.log(err);
  });;
