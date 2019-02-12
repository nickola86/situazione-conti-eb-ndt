var Utenti = function () {};
var db = require("./database");

Utenti.prototype.all = async function () {
  var usrs = db.get('utenti').value();
  return usrs;
};

module.exports = new Utenti();
