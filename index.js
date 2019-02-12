var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var movimenti = require('./services/movimenti');
var rimborsi = require('./services/rimborsi');
var portafogli = require('./services/portafogli');
var utenti = require('./services/utenti');
var tipoOperazioni = require('./services/tipo-operazioni');


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
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
app.use(express.static('app'));

app.get('/api/movimenti', async function(req, res){
  res.send(await movimenti.all());
});
app.post('/api/movimenti/create', async function(req, res){
  res.send(await movimenti.create(req.body));
});
app.post('/api/movimenti/destroy', async function(req, res){
  res.send(await movimenti.destroy(req.body));
});
app.get('/api/rimborsi', async function(req, res){
  res.send(await rimborsi.all());
});


app.get('/api/portafogli', async function(req, res){
  res.send(await portafogli.all());
});
app.get('/api/utenti', async function(req, res){
  res.send(await utenti.all());
});
app.get('/api/tipo-operazioni', async function(req, res){
  res.send(await tipoOperazioni.all());
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
