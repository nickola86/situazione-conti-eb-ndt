var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var movimenti = require('./services/movimenti');
var rimborsi = require('./services/rimborsi');
var portafogli = require('./services/portafogli');
var utenti = require('./services/utenti');
var tipoOperazioni = require('./services/tipo-operazioni');

var PASSWORD_SICURISSIMISSIMA = 'vincenzo gay';


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cookieParser());

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
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await movimenti.all());
  else res.send({error:"unauthorized"});
});
app.post('/api/movimenti/create', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await movimenti.create(req.body));
  else res.send({error:"unauthorized"});
});
app.post('/api/movimenti/destroy', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await movimenti.destroy(req.body));
  else res.send({error:"unauthorized"});
});
app.post('/api/movimenti/update', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await movimenti.update(req.body));
  else res.send({error:"unauthorized"});
});
app.get('/api/rimborsi', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await rimborsi.all());
  else res.send({error:"unauthorized"});
});

app.get('/api/portafogli', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await portafogli.all());
  else res.send({error:"unauthorized"});
});
app.get('/api/utenti', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await utenti.all());
  else res.send({error:"unauthorized"});
});
app.get('/api/tipo-operazioni', async function(req, res){
  if(PASSWORD_SICURISSIMISSIMA===req.cookies.auth) res.send(await tipoOperazioni.all());
  else res.send({error:"unauthorized"});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
