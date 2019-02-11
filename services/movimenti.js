var Movimenti = function () {};
var db = require("./database");

Movimenti.prototype.all = async function () {
  var movs = db.get('movimenti').sortBy('date').value();
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
  return movs.reverse();
};

Movimenti.prototype.create = async function (mov) {
  var len = db.get('movimenti').size();
  var newId = (db.get('movimenti').sortBy('id').value()[len-1] || {id:0}).id + 1;
  mov.id = newId;
  mov.importo = parseFloat(mov.importo);
  if(!mov.tipoOperazione) mov.tipoOperazione = 'Uscita';
  
  //Join Utenti
  mov.idUtente = parseInt(mov.idUtente);
  mov.utente = db.get('utenti').filter({id:mov.idUtente}).value()[0];  
  //Join Portafogli
  mov.idPortafoglio = parseInt(mov.idPortafoglio);
  mov.portafoglio = db.get('portafogli').filter({id:mov.idPortafoglio}).value()[0];
  
  db.get('movimenti').push(mov).write();  
  return this.all();
};

module.exports = new Movimenti();
