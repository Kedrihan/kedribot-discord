var exports = (module.exports = {});

exports.mp = async function (message, cruellaServerMembers) {
    if(message.guild === null && message.author.username === "Kedrihan" && message.content === "123mp") {
        
        message.channel.send("Ok.");
        message.channel.recipient = cruellaServerMembers.get("288659667268141056");
        message.channel.send("_Transmission entrante de la part de Kedrihan_ \n"+message)
    }
    if(message.guild === null && !message.author.username === "Kedrihan") {

        message.channel.send("Ton message va être transférer à Kedrihan :)");

        message.channel.recipient = cruellaServerMembers.get("116893981526196227");

        message.channel.send(message);
    }
}