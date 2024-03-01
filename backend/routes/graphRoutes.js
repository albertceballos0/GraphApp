const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Rutas CRUD para usuarios

router.get('/files', graphController.getAllGraphs);         // Obtener todos los archivos por defecto
router.get('/files/:username', graphController.getPersonalGraphs);         // Obtener todos los archivos de ese usuario

router.get('/:id', graphController.getFileGraph);  //obtener ese grafo en concreto

router.get('/comprove/:checksum', graphController.getGraph);  //obstener si existe ese grafo

router.post('/generate', graphController.setGraph);  //crear grafo 
router.post('/visits', graphController.setVisits); // crear archivo visitas
router.post('/track', graphController.execTrack);  //generar camino a partir de visitas y grafo previamente cargado

router.post('/initialize/:id', graphController.setCheckSum);         // Obtener todos los usuarios

router.get('/borrar/:archivo', graphController.deleteGraph);

module.exports = router;
