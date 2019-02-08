var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const LOCALDB = 'db.json';
const adapter = new FileSync(LOCALDB)
var db = null;
var port = process.env.PORT || 3000;
var currentFrame = "";


if (!fs.existsSync(LOCALDB)) {
	// crea il db se non esiste
	db = low(adapter);
	db.defaults({ events: [] }).write();    
}else{
	db = low(adapter);
}

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});
app.get('/api/movimenti', function(req, res){
  var movs = db.get('movimenti').value();
  movs = movs.map(e=>{
	  e.utente = db.get('utenti').filter({id:e.idUtente}).value()[0];
	  delete e.userId;
	  return e;
  });
  res.send(movs);
});
app.get('/api/movimenti/:idUtente', function(req, res){
  res.send(db.get('movimenti').filter({idUtente:req.params.idUtente}).sortBy('data'));
});
app.post('/api/movimenti/new', function(req, res){
	console.log(req.body);
	res.send(db.get('movimenti'));
});	

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function getToday() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
