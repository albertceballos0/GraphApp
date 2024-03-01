const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas CRUD para usuarios

router.get('/', userController.getAllUsers);         // Obtener todos los usuarios
router.post('/register', userController.createUser);         // Crear un nuevo usuario
router.post('/login', userController.authenticateUser);         // Crear un nuevo usuario
router.get('/userId/:username', userController.getUserId);



module.exports = router;
