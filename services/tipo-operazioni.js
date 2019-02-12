var TipoOperazioni = function () {};
var db = require("./database");

TipoOperazioni.prototype.all = async function () {
  var tipops = db.get('tipo-operazioni').value();
  return tipops;
};

module.exports = new TipoOperazioni();
