var express = require('express');
var Asterisk = require('./lib/Asterisk');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var queuesIO = io.of('/queues');

var asterisk = new Asterisk({
  host: '192.168.1.136',
  amiUsername: 'test',
  amiPassword: 'secret'
});

asterisk.init(function(err){
  console.log('FOOO', err);
  if(err) throw new Error('it\'s fucked - ami connection');
  console.log('initialised');
});

app.use('/js/', express.static(__dirname + '/client/js'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

app.get('/index.html', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

app.get('/index-plain.html', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

queuesIO.on('connection', function(socket){
  socket.on('requestHistoricalQueue', function(requestedQueue, points){
    var queue = asterisk.getQueue(requestedQueue);
    if(queue){
      var historical = queue.getHistorical(points);
      socket.emit('historical', queue.queue, historical);

      asterisk.on(queue.queue + 'Change', function(change){
        console.log('Queue changed!');
        socket.emit('latest', queue.queue, change);
      });
    }else{
      //error!
      console.log('Requested a queue that doesn\'t exist', requestedQueue);
    }
  });
});

server.listen(8080);

