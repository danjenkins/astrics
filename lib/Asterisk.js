var Ami = require('asterisk-ami');
var Queue = require('./Queue');
var Call = require('./Call');
var eventHelpers = require('./eventHelpers');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Asterisk(options){
  this._queues = {};
  this._calls = {};
  this._ami = new Ami({ host: options.host, username: options.amiUsername, password: options.amiPassword, debug: true });
}

util.inherits(Asterisk, EventEmitter);

module.exports = Asterisk;

Asterisk.prototype.init = function(cb){
  var self = this;
  self._ami.on('login', function(err){
    if(err){
      return cb(new Error('unable to connect to AMI - ' + err.toString()));
    }

    // self._ami.on('data', function(event){
    //   console.log(event);
    // });

    self._ami.on('join',
      eventHelpers.queueTraffic.bind(self)
    )
    .on('data', function(event){
      console.log('join', event);
    })
    .on('leave',
      eventHelpers.queueTraffic.bind(self)
    ).on('newchannel',
      eventHelpers.newCall.bind(self)
    ).on('hangup',
      eventHelpers.removeCall.bind(self)
    );

    //prob want to listen for callercomplete callerabandon events

    self._ami.send({Action: 'QueueStatus'}, eventHelpers.queueStatusResponse.bind(self) );

    return cb(null);

  });

  this._ami.connect();
};

Asterisk.prototype.addQueue = function(queue){
  if(queue && queue instanceof Queue && queue.queue){
    this._queues[queue.queue] = queue;
    return queue;
  }
  return null;
};

Asterisk.prototype.getQueue = function(queue){
  return this._queues[queue];
};

Asterisk.prototype.addCall = function(call){
  if(call instanceof Call && call.id){
    this._calls[call.id] = call;
  }
};

Asterisk.prototype.removeCall = function(call){
  if(call instanceof Call && call.id){
    delete this._calls[call.id];
  }
};

Asterisk.prototype.updateCall = function(call){
  //update the queue or the position
};

Object.defineProperty(Asterisk.prototype, 'queueList', {
  get: function(){
    return Object.keys(this._queues);
  }
});
