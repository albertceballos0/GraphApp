const express = require('express');

const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js')
const graphRoutes = require('./routes/graphRoutes.js')

const app = express();
app.use(express.json());


// Configurar CORS para permitir solicitudes solo desde localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

// Ruta base para usuarios
app.use('/users', userRoutes);
app.use('/graph', graphRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

