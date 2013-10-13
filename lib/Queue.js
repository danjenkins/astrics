function Queue(queue, info){
  this.queue = queue;
  this.currentCalls = info.calls || null;
  this.gradeOfService = info.servicelevelperf || null;
  this.answeredCalls = info.completed || null;
  this.abandonedCalls = info.abandoned || null;
  this.averageTalkTime = info.talktime || null;
  this.averageHoldTime = info.holdtime || null;
  this.members = [];
  this.history = {
    currentCalls: []
  };
}

module.exports = Queue;

Queue.prototype.getHistorical = function(points){
  var self = this;
  if(points){
    var tmpHistory = {};
    Object.keys(this.history).forEach(function(key){
      tmpHistory[key] = self.history[key].slice( (points * -1) );
    });
    return tmpHistory;
  }

  return this.history;
};

Queue.prototype.setCalls = function(callCount){
  this.history.currentCalls.push({
    date: new Date(),
    value: callCount
  });
  this.currentCalls = callCount || 0;
};
