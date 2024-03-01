const express = require('express');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const graphRoutes = require('./routes/graphRoutes.js');
const cameraAppRoutes = require('./routes/cameraAppRoutes.js');
const socketIo = require('socket.io');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(express.json());

// Configurar CORS para permitir solicitudes desde el origen localhost:5173
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.0.2:5173', 'http://172.20.10.11:5713', 'http://127.0.0.1:5000']
}));



// Ruta base para usuarios
app.use('/users', userRoutes);
app.use('/graph', graphRoutes);
app.use('/camera', cameraAppRoutes);

const server = http.createServer(app);
const io = socketIo(server);
let confirm = null;
let clientQR = null;
let msg = null;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
    
  socket.on('message', (message) =>{
    if(msg === message) return;
    else{
      console.log(message);
      msg = message;
      socket.broadcast.emit('message' , message);
    }
  }); 
  socket.on('prepared', (data) =>{
    console.log('prepared', data);
    socket.broadcast.emit('prepared', data);
    
  });
  socket.on('conectado', (data) =>{
    console.log('conectado', data);
    socket.broadcast.emit('conectado', data);
    
  });
  socket.on('withoutTrack', (message) =>{
    if(msg === message) return -1;
    else{
      console.log(message);
      msg = message;
      socket.broadcast.emit('withoutTrack' , message);
    }
  });
  socket.on('onTrack', (message) =>{
    if(msg === message) return -1;
    else{
      console.log(message);
      msg = message;
      socket.broadcast.emit('onTrack' , message);
    }
  });
  socket.on('logueado', (message) =>{
      console.log('logueado', message);
      socket.broadcast.emit('logueado' , message);
    
  });
  socket.on('logout', (message) =>{
      console.log(message);
      socket.broadcast.emit('logout' , message);
    
  });
  

  socket.on('confirm', (peerId) => {
    if(confirm === peerId) return;
    else confirm = peerId;
    // Broadcast the peerId to all connected clients except the sender
    console.log(peerId);
    socket.broadcast.emit('confirm', peerId);
  });

  socket.on('enviar', () => {
    socket.broadcast.emit('enviar');
  });


});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
