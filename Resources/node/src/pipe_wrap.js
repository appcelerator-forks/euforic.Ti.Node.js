/**
 * Pipe - Node Native Wrapper
 *
 * @status sketchy
 */

function Pipe(){
  if (!(this instanceof Pipe)) return new Pipe(options);
  this.proxy = Ti.Network.Socket.createPipe({connected:this.onConnected});
}

Pipe.prototype.onConnected = function (e){
  this.oncomplete(0,e,true,true);
};

Pipe.prototype.getSockName = function (){

};

Pipe.prototype.getPeerName = function (){

};

Pipe.prototype.setNoDelay = function (){

};

Pipe.prototype.setKeepAlive = function (){

};

Pipe.prototype.bind = function (){

};

Pipe.prototype.bind6 = function (){

};

Pipe.prototype.listen = function (){

};

Pipe.prototype.writeBuffer = function(data){
  var data = Ti.createBuffer({
    value: 'data'
  });
  this.proxy.write(data);
};

Pipe.prototype.connect = function ( address, arg ){
  this.host = address;
  this.port = arg;

  this.proxy.setHost(this.host);
  this.proxy.setPort(this.port);
  this.proxy.connect();
  return this;
};

Pipe.prototype.connect6 = function (){

};

Pipe.prototype.open = function ( address, port ){
  this.host = address;
  this.port = arg;

  this.proxy.setHost(this.host);
  this.proxy.setPort(this.port);
  this.proxy.connect();
  return this;
};

Pipe.prototype.onConnect = function (){
};

Pipe.prototype.afterConnect = function (){

};

exports.Pipe = Pipe;