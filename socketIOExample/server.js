
//
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port= process.env.PORT || 8081;
server.listen(port);

io.sockets.on('connection', function (socket) {
  socket.on('location', function (data) {
    io.sockets.emit('location', data);
  });
});

// For serving static files inside ./client
app.use(require('express').static(__dirname + '/../www'));

// For hosing on Heroku 
/*io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1)
});*/