var Movimenti = function () {};
var db = require("./database");

Movimenti.prototype.all = async function () {
  var movs = db.get('movimenti').value();
  var cacheUtenti = [];
  var cachePortafogli = [];
  //Join Utenti
  movs = movs.map(e=>{
	  if(cacheUtenti[e.idUtente]){
		//Efficiente
		e.utente = cacheUtenti[e.idUtente];
	  }else{
		//Chiama il db
		e.utente = db.get('utenti').filter({id:e.idUtente}).value()[0];  
		cacheUtenti[e.idUtente] = e.utente;
	  }
	  return e;
  });
  delete cacheUtenti;
  //Join Portafogli
  movs = movs.map(e=>{
	  if(cachePortafogli[e.idPortafoglio]){
		//Efficiente
		e.portafoglio = cachePortafogli[e.idPortafoglio];
	  }else{
		//Chiama il db
		e.portafoglio = db.get('portafogli').filter({id:e.idPortafoglio}).value()[0];
		cachePortafogli[e.idPortafoglio] = e.portafoglio;
	  }
	  return e;
  });
  delete cachePortafogli;
  return movs;
};

Movimenti.prototype.create = async function (mov) {
  console.log(mov);
  return this.all();
};

module.exports = new Movimenti();
