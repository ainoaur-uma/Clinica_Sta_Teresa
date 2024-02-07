const express = require('express');
const router = express.Router();

// Importar el controlador
const usuarioController = require('../controllers/usuarioController');

// Definición de rutas:
router.post('/', usuarioController.create); //crear un nuevo usuario
router.get('/', usuarioController.findAll); //obtener todos los usuarios
router.get('/:usuarioId', usuarioController.findOne); // obtener un usuario por su ID
router.get('/nombre/:nombre_usuario', usuarioController.findByUsername);
router.patch('/:usuarioId', usuarioController.updateById); //actualizar un usuario por su ID utilizando PATCH
router.delete('/:usuarioId', usuarioController.deleteById); //eliminar un usuario por su ID
router.get('/ordenadosPorNombre', usuarioController.getAllSortedByName);

// Exportar el router
module.exports = router;