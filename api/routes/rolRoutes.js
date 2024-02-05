const express = require('express');
const router = express.Router();

// Importar el controlador
const rolController = require('../controllers/rolController');

// Definición de rutas para la entidad rol:
router.post('/', rolController.create); //crear un nuevo rol
router.get('/', rolController.findAll); //obtener todos los roles
router.get('/:rolId', rolController.findOne); // obtener un rol por su ID
router.patch('/:rolId', rolController.update); //actualizar un rol por su ID (utilizando PATCH)
router.delete('/:rolId', rolController.delete); //eliminar un rol por su ID

// Exportar el router
module.exports = router;
