const express = require('express');
const router = express.Router();
const fileRecognitionController = require('../controllers/fileRecognitionController');

// Rutas CRUD para usuarios

router.post('/addfile', fileRecognitionController.addFile);         // Obtener todos los archivos por defecto
router.get('/getfiles/:userId', fileRecognitionController.getFiles);         // Obtener todos los archivos por defecto

module.exports = router;

