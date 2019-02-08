var Rimborsi = function () {};
var db = require("./database");

Rimborsi.prototype.all = async function () {
  var movs = db.get('rimborsi').value();
  var cacheUtenti = [];
  var cachePortafogli = [];
  //Join Ordinanti
  movs = movs.map(e=>{
	  if(cacheUtenti[e.idUtenteOrdinante]){
		//Efficiente
		e.utenteOrdinante = cacheUtenti[e.idUtenteOrdinante];
	  }else{
		//Chiama il db
		e.utenteOrdinante = db.get('utenti').filter({id:e.idUtenteOrdinante}).value()[0];  
		cacheUtenti[e.idUtenteOrdinante] = e.utenteOrdinante;
	  }
	  return e;
  });
  //Join Beneficiari
  movs = movs.map(e=>{
	  if(cacheUtenti[e.idUtenteBeneficiario]){
		//Efficiente
		e.utenteBeneficiario = cacheUtenti[e.idUtenteBeneficiario];
	  }else{
		//Chiama il db
		e.utenteBeneficiario = db.get('utenti').filter({id:e.idUtenteBeneficiario}).value()[0];  
		cacheUtenti[e.idUtenteBeneficiario] = e.utenteBeneficiario;
	  }
	  return e;
  });
  delete cacheUtenti;
  return movs;
};

module.exports = new Rimborsi();
