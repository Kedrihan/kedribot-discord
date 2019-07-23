var exports = (module.exports = {});

exports.mp = function (message, cruellaServerMembers) {
    if(message.guild === null && message.author.username === "Kedrihan") {
        
        message.channel.send("Ok.");
        userToSend = cruellaServerMembers.get("288659667268141056");
        userToSend.send("_Transmission entrante de la part de Kedrihan_ \n"+message)
    }
}