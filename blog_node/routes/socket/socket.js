const socket_io = require('socket.io');

const socket_obj = {};
socket_obj.getSocketServer = (server) => {
  let io =  socket_io(server);

  io.on('connection', (socket) => {
    socket.on('commitwillsubmit', (data) => {
      socket.broadcast.emit('commitSubmitDid', { data: data});
    });
  });
};

module.exports = socket_obj;