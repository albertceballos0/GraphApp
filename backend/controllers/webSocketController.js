// controllers/websocketController.js

const socketIo = require('socket.io');

const clients = {}; // Almacena las conexiones de los clientes por su identificador

exports.initWebSocketServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

  });
}
