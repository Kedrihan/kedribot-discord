var exports = (module.exports = {});

exports.mp = function (message, cruellaServerMembers) {
    if(message.guild === null && message.author.username === "Kedrihan") {
        
        message.channel.send("Ok.");
        userToSend = cruellaServerMembers.get("288659667268141056");
        userToSend.send("_Transmission entrante de la part de Kedrihan_ \n"+message)
    }
    if(message.guild === null && !message.author.username === "Kedrihan") {

        message.channel.send("Ton message va être transféré à Kedrihan :)");

        kedrihan = cruellaServerMembers.get("116893981526196227");

        kedrihan.send("_Transmission entrante de la part de "+message.author.username+"_ \n"+message);
    }
}