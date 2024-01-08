const socketIO = require('socket.io');

let io;

module.exports.initialize = function(server) {
  io = socketIO(server);
  io.on('connection', (socket) => {
  });
}

module.exports.emit = function(eventName, data) {
  io.emit(eventName, data);
}


