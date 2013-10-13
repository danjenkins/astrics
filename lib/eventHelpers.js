var Call = require('./Call');
var Queue = require('./Queue');

var obj = {
  queueTraffic: function (event){
    if(event.queue){
      var queue = this.getQueue(event.queue);
      if(queue){//we know about this queue
        queue.setCalls(event.count);
        this.updateCall(event);
      }
    }
  },
  newCall: function(event){
    this.addCall(new Call(event));
  },
  removeCall: function(event){
    this.removeCall(new Call(event));
  },
  queueStatusResponse: function(err, event){
    var self = this;
    if(event && event.event == 'QueueParams'){
      var queue = this.addQueue(new Queue(event.queue, event));
      Object.observe(queue, obj.observeQueueChanges.bind(self));
    }
  },
  observeQueueChanges: function(changes){
    var self = this;
    changes.forEach(function(change){
      //console.log('change!', change);
      self.emit(change.object.queue + 'Change', change );
    });
  }
};

module.exports = obj;