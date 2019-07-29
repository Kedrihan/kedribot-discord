var exports = (module.exports = {});
let connection = require("./dbHandler.js");

exports.mp = function (message, cruellaServerMembers) {
    if (message.guild === null && message.author.username === "Kedrihan") {

        message.channel.send("Ok.");
        let sql = "SELECT * FROM mp";
        connection.query(sql, (err, res) => {
            if (typeof res[0] != "undefined") {
                res.forEach(id => {
                    userToSend = cruellaServerMembers.get(id.id);
                    userToSend.send("_Transmission entrante de la part de Kedrihan_ \n" + message)
                });
            }
        });

    }
}