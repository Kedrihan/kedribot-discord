var exports = (module.exports = {});
let connection = require("./includes/dbHandler.js");

exports.mp = function (message, cruellaServerMembers) {
    if (message.guild === null && message.author.username === "Kedrihan") {
        let sql = "SELECT * FROM mp";
        connection.query(sql, (err, res) => {
            if (typeof res[0] != "undefined") {
                res.forEach(id => {
                    userToSend = cruellaServerMembers.get(id.id);
                    if (typeof userToSend !== 'undefined') {
                        userToSend.send("_Transmission entrante de la part de Kedrihan_ \n" + message);
                        message.channel.send("Message envoyé à " + userToSend.user.username);
                    }
                    else {
                        message.channel.send(id);
                    }
                });
            }
        });

    }
}