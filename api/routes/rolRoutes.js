const express = require('express');
const router = express.Router();

// Importar el controlador
const rolController = require('../controllers/rolController');

// Definición de rutas para la entidad rol:
router.post('/', rolController.create); // Crear un nuevo rol
router.get('/', rolController.findAll); // Obtener todos los roles
router.get('/:idRol', rolController.findOne); // Obtener un rol por su ID
router.get('/descripcion/:descripcion', rolController.findByDescripcion); // Obtener roles por descripción
router.patch('/:idRol', rolController.updateById); // Actualizar un rol por su ID
router.delete('/:idRol', rolController.deleteById); // Eliminar un rol por su ID

// Exportar el router
module.exports = router;
