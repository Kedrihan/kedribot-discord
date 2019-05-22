const mysql = require('mysql');
let configAuth = require("./auth.json");

let pool = mysql.createPool({
  host: 'localhost',
  user: configAuth.bddUser,
  password: configAuth.bddPassword,
  database: configAuth.bdd
});

module.exports = {
  query: function () {
    let sql_args = [];
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    let callback = args[args.length - 1]; //last arg is callback
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return callback(err);
      }
      if (args.length > 2) {
        sql_args = args[1];
      }
      connection.query(args[0], sql_args, function (err, results) {
        connection.release(); // always put connection back in pool after last query
        if (err) {
          console.log(err);
          return callback(err);
        }
        callback(null, results);
      });
    });
  }
};