const express = require('express');
const router = express.Router();
const fileRecognitionController = require('../controllers/fileRecognitionController');


router.post('/addfile', fileRecognitionController.addFileController);         // Obtener todos los archivos por defecto
router.get('/getfiles/:userId', fileRecognitionController.getFiles);         // Obtener todos los archivos por defecto
router.get('/deletefile/:filename', fileRecognitionController.deleteFile);         // Obtener todos los archivos por defecto

module.exports = router;

