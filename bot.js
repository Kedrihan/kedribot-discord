#!/usr/bin/node
const Discord = require("discord.js");
const client = new Discord.Client();
let pendu = require("./pendu.js");
let duel = require("./duel.js");
// Get authentication data
let AuthDetails = require("./includes/auth.json");
let commandsList = ["pendu", "devine", "duel", "link", "alcool", "jusdepomme", "commu", "unlink", "royalrumble", "profile", "charslink"]


const commandPrefix = '!';

// Register our event handlers (defined below):
var CooldownManager = {
    cooldownTime: 8000, // 8 seconds
    store: {
        '!pendu': 1543848572,
        '!devine': 1543848572,
        '!duel': 1543848572,
        '!link': 1543848572,
        '!alcool': 1543848572,
        '!jusdepomme': 1543848572,
        '!commu': 1543848572,
        '!unlink': 1543848572,
        '!royalrumble': 1543848572,
        '!profile': 1543848572,
        '!charslink': 1543848572,
    },

    canUse: function (commandName) {
        // Check if the last time you've used the command + 8 seconds has passed
        // (because the value is less then the current time)
        return this.store[commandName] + this.cooldownTime < Date.now();
    },
    canUseRR: function (commandName) {
        // Check if the last time you've used the command + 24h for RoyalRumble
        // (because the value is less then the current time)
        return this.store[commandName] + 86400000 < Date.now();
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
    let Wowee = msg.guild.emojis.find(emoji => emoji.name === "Wowee");
    let Pog = msg.guild.emojis.find(emoji => emoji.name === "Pog");
    let MonkaMega = msg.guild.emojis.find(emoji => emoji.name === "MonkaMega");
    let BibleThumb = msg.guild.emojis.find(emoji => emoji.name === "BibleThumb");
    let FeelsCoolMan = msg.guild.emojis.find(emoji => emoji.name === "FeelsCoolMan");
    let issou = msg.guild.emojis.find(emoji => emoji.name === "issou");
    let PagChomp = msg.guild.emojis.find(emoji => emoji.name === "PagChomp");
    let sad = msg.guild.emojis.find(emoji => emoji.name === "sad");
    let emojis = [VoHiYo, POGGERS, cmonBruh, FeelsBaguetteMan, Horde, Wowee, Pog, MonkaMega, BibleThumb, FeelsCoolMan, issou, PagChomp, sad];
    if(msg.content.includes("534293066731880458") && !msg.content.includes(commandPrefix+"duel")) {
        msg.channel.send("Arrête de me tag stp "+FeelsBaguetteMan)
        return;
    }
    if(msg.channel.name === "emote-only") {
        if(!msg.content.toString().match(/<(?:[^\d>]+|:[A-Za-z0-9]+:)\w+>/g)) {
            msg.delete();
        }
    }
    //CD
    for (const cmd of commandsList) {
        if (msg.content.indexOf(commandPrefix + cmd) > -1) {
            if (cmd != "royalrumble") {
                if (CooldownManager.canUse(msg.content.split(' ')[0])) {
                    CooldownManager.touch(msg.content.split(' ')[0]);
                }
                else {
                    return;
                }
            }
        }
    }

    if (msg.content === commandPrefix + "alcool" || msg.content === commandPrefix + "jusdepomme") {
        msg.channel.send(emojis[0] + " <http://www.alcool-info-service.fr/> ");
    }
    if (msg.content === commandPrefix + "commu") {
        msg.channel.send(emojis[0] + " <https://worldofwarcraft.com/fr-fr/invite/r9mGL2HbXZ?region=EU&faction=Horde> " + emojis[4]);
    }
    pendu.pendu(msg, emojis, commandPrefix, client);
    duel.duel(msg, emojis, commandPrefix, msg.guild.members, commandsList, CooldownManager);
});

client.login(AuthDetails.token).catch((err) => {
    console.log(err);
});;
