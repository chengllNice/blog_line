import io from 'socket.io-client'

const socket = io('http://locahost:3000');

socket.on('aa', (data) => {
  console.log(data)
});

module.exports = socket;
