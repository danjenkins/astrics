function Call(info){
  this.id = info.uniqueid || null;
  this.queue = info.queue || null;
  this.callerId = info.calleridnum || null;
  this.callerIdNumber = info.calleridname || null;
}

module.exports = Call;