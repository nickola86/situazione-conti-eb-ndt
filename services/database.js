var fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const LOCALDB = 'db.json';
const adapter = new FileSync(LOCALDB)
var db = null;

var Database = function () {
	if (!fs.existsSync(LOCALDB)) {
		// crea il db se non esiste
		db = low(adapter);
		db.defaults({ events: [] }).write();    
	}else{
		db = low(adapter);
	}
	return db;
};

module.exports = new Database();
