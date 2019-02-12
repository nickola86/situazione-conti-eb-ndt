var Portafogli = function () {};
var db = require("./database");

Portafogli.prototype.all = async function () {
  var usrs = db.get('portafogli').value();
  return usrs;
};

module.exports = new Portafogli();
