/**
 * TCP - Node Native Wrapper
 *
 * @status sketchy
 */

function TCP(){
  if (!(this instanceof TCP)) return new TCP(options);
  this.proxy = Ti.Network.Socket.createTCP({connected:this.onConnected});
  this.destroyed = false;
  this._onCompleteCalled = false;
}

TCP.prototype.onConnected = function (e){
  this._conn = e;
};

Object.defineProperty(TCP.prototype, 'oncomplete', {
  get: function(){
    return this._oncomplete;
  },
  set: function(fn) {
    if(!this._oncompleteCalled){
      fn(0,this,null,true,true);
      this._onCompleteCalled = true;
    }
    this._oncomplete = fn;
  }
});

TCP.prototype.getSockName = function (){

};

TCP.prototype.readStart = function (){

};

TCP.prototype.getPeerName = function (){

};

TCP.prototype.setNoDelay = function (){

};

TCP.prototype.setKeepAlive = function (){

};

TCP.prototype.bind = function (){

};

TCP.prototype.bind6 = function (){

};

TCP.prototype.listen = function (){

};

TCP.prototype.writeBuffer = function(data){
  var data = Ti.createBuffer({
    value: 'data'
  });
  this.proxy.write(data);
};

TCP.prototype.connect = function ( address, arg ){
  this.host = address;
  this.port = arg;
  this.proxy.setHost(this.host);
  this.proxy.setPort(this.port);
  this.proxy.connect();
  return this;
};

TCP.prototype.connect6 = function (){

};

TCP.prototype.open = function ( address, port ){
  this.host = address;
  this.port = arg;
  this.proxy.setHost(this.host);
  this.proxy.setPort(this.port);
  this.proxy.connect();
  return this;
};

TCP.prototype.onConnect = function (){
};

TCP.prototype.afterConnect = function (){

};

exports.TCP = TCP;