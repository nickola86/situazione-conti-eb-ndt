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
  res.sendFile(__dirname + '/events.html');
});
app.get('/api/events', function(req, res){
  res.send(db.get('events'));
});
app.get('/api/events/clean', function(req, res){
  db.get('events').remove().write();
  res.send(db.get('events'));
});
app.get('/api/events/:user', function(req, res){
  res.send(db.get('events').filter({user:req.params.user}).sortBy('datetime'));
});
app.get('/api/events/:user/today', function(req, res){
  var events = db.get('events').filter({user:req.params.user}).sortBy('datetime').value();
  events = events.filter(function(e){
	  var d1 = new Date(); 
	  var d2 = new Date(e.datetime); 
	  return d1.getDate() === d1.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d1.getFullYear();
  });
  events = events.filter(Boolean);
  res.send(events);
});
app.post('/api/event/:user/:datetime', function(req, res){
	console.log("/api/event/"+req.params.user+"/"+req.params.datetime,req.body);
	var events = db.get('events').find({user:req.params.user,datetime:req.params.datetime}).assign(req.body);
	db.write();
	console.log("/api/event/"+req.params.user+"/"+req.params.datetime,events);
	res.send(events);
});
app.post('/api/event/:user/:datetime/delete', function(req, res){
	console.log("/api/event/"+req.params.user+"/"+req.params.datetime+"/delete",req.body);
	var events = db.get('events').find({user:req.params.user,datetime:req.params.datetime}).remove();
	db.write();
	console.log("/api/event/"+req.params.user+"/"+req.params.datetime+"/delete",events);
	res.send(events);
});
app.get('/download', function(req, res){
  res.sendFile(__dirname + '/dist/timbrature.zip');
});
app.get('/api/users', function(req, res){
  var users = [];
  db.get('events').value().map(function(e){
	  if(users.indexOf(e.user)<0) users.push(e.user);
  });
  res.send(users);
});

app.post('/api/event/new', function(req, res){
  console.log(req.body);
  var event = req.body;
  event.datetime = new Date();
  event.elapsed = 0;
  //Recupero l'ultimo evento
  var dbevents = db.get('events').filter({user:event.user}).sortBy('datetime').value();
  if(dbevents.length>0){
	  var lastevt = dbevents[dbevents.length-1];
	  var diff = (new Date(event.datetime)) - (new Date(lastevt.datetime));
	  if(lastevt.type==event.type){
		  event.elapsed = lastevt.elapsed + diff;
		  //Aggiorno l'ultimo evento sul db
		  db.get('events').find(lastevt).assign({datetime:event.datetime,elapsed:event.elapsed}).write();
	  }else{
		  event.elapsed = diff;
		  //Inserisco il nuovo evento sul db
		  db.get('events').push(event).write();
	  }  	  
  }else{
	//Inserisco il nuovo evento sul db
	db.get('events').push(event).write();
  }

  res.send(db.get('events'));
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
