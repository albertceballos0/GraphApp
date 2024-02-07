const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Rutas CRUD para usuarios

router.get('/files', graphController.getAllGraphs);         // Obtener todos los usuarios
router.get('/:id', graphController.getFileGraph);         // Obtener todos los usuarios

module.exports = router;
