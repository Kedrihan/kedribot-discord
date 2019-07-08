let connection = require("./dbHandler.js");

module.exports = {
  removeUserRank: function (member) {
    let memberId = member.id;
    let sql = "DELETE FROM ranking WHERE id_user=?";
    connection.query(sql, [memberId], (err, res) => {
      if (err) console.log(err);
    });
  },
  winLetter: function (user) {
    let sql = "SELECT * FROM ranking WHERE id_user=?";
    connection.query(sql, [user.id], (err, res) => {
      if (err) console.log(err);
      if (res[0] === undefined) {
        sql = "INSERT INTO ranking (id_user, score) VALUES (?, ?)";
        connection.query(sql, [user.id, 1], (err, res) => {
          if (err) console.log(err);
        });
      } else {
        res[0].score += 1;
        sql = "UPDATE ranking SET score=? WHERE id_user=?";
        connection.query(sql, [res[0].score, user.id], (err, res) => {
          if (err) console.log(err);
        });
      }
    });
  },
  winWord: function (user) {
    let sql = "SELECT * FROM ranking WHERE id_user=?";
    connection.query(sql, [user.id], (err, res) => {
      if (err) console.log(err);
      if (res[0] === undefined) {
        sql = "INSERT INTO ranking (id_user, score) VALUES (?, ?)";
        connection.query(sql, [user.id, 2], (err, res) => {
          if (err) console.log(err);
        });
      } else {
        res[0].score += 2;
        sql = "UPDATE ranking SET score=? WHERE id_user=?";
        connection.query(sql, [res[0].score, user.id], (err, res) => {
          if (err) console.log(err);
        });
      }
    });
  },
  getTopFive: function (message, limit) {
    let sql = "SELECT * FROM ranking ORDER BY score DESC LIMIT " + limit;
    connection.query(sql, (err, res) => {
      if (err) console.log(err);
      if (typeof res != "undefined" && res.length > 0) {
        let msg = "```";
        for (let i = 0; i < res.length; i++) {
          let usr = message.guild.members.get(res[i].id_user);
          msg = msg.concat("\n", i + 1 + " - " + usr.user.username + " - " + res[i].score + " point(s)");
        }
        msg = msg.concat(" ", "```");
        message.channel.send(msg);
      } else {
        message.channel.send(
          "`Il n'y a pas encore de classement (ou alors ça bug lel)`"
        );
      }
    });
  },
  affPendu: function (failures) {
    let hang = ""
    switch (failures) {
      case 0:
        hang = "``` \n      \n \n \n \n```";
        break;
      case 1:
        hang = "``` \n      \n \n \n \n━┻━```";
        break;
      case 2:
        hang = "``` \n ┃     \n ┃\n ┃\n ┃\n━┻━```";
        break;
      case 3:
        hang = "``` ┏━━━━━┯\n ┃     \n ┃\n ┃\n ┃\n━┻━```";
        break;
      case 4:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃\n ┃\n ┃\n━┻━```";
        break;
      case 5:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃     O\n ┃\n ┃\n━┻━```"
        break;
      case 6:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃     O\n ┃     X\n ┃\n━┻━```";
        break;
      case 7:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O\n ┃     X\n ┃\n━┻━```";
        break;
      case 8:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃\n━┻━```";
        break;
      case 9:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃    /\n━┻━```";
        break;
      case 10:
        hang = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃    / \\\n━┻━```";
        break;
    }
    return hang;
  }
};
