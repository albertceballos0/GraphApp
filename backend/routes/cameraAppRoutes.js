const express = require('express');
const router = express.Router();
const cameraAppController = require('../controllers/cameraAppController');

// Rutas CRUD para usuarios

router.get('/generate-qr', cameraAppController.generateQR);         // Obtener todos los archivos por defecto
router.get('/validate-token/:token', cameraAppController.validateQR);         // Obtener todos los archivos de ese usuario
router.get('/token-free/:token/:username', cameraAppController.tokenFree);         // Obtener todos los archivos de ese usuario

router.get('/liberarToken/:token', cameraAppController.liberarToken);         // Obtener todos los archivos de ese usuario

module.exports = router;
