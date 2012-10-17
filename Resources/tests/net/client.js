
var net  = node.require('net')
  , socket = net.Socket();


socket.on('connect',function(){
  alert('connected event fired');
});

socket.connect({port:5000, host:'efc.x'},function(){
  alert('connected');
});