var io = require('socket.io')();
var ph = require('../interfaces/permission.handler');

io.on('connection', function(socket){

  var socketName = 'Socket(' + socket.id + ')';

  // socket.on('disconnecting', function(reason){
  //   console.log(socketName + ' disconnect-ing : ' + reason);
  // });

  socket.on('disconnect', function(reason){

  });

  socket.on('error', function(error){
    console.log(socketName + ' error : ' + error);
  });

  socket.on('add', function(msg){
    io.emit('new', msg);
  });

});

module.exports = io;
