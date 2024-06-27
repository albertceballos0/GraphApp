const express = require('express');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const graphRoutes = require('./routes/graphRoutes.js');

require('dotenv').config();

const app = express();

app.use(express.json());

// Configurar CORS para permitir solicitudes desde el origen localhost:5173
app.use(cors());



// Ruta base para usuarios
app.use('/users', userRoutes);
app.use('/graph', graphRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
