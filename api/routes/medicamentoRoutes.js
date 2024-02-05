const express = require('express');
const router = express.Router();

// Importar el controlador
const medicamentoController = require('../controllers/medicamentoController');

// Definición de rutas para la entidad medicamento:
router.post('/', medicamentoController.create); // Crear un nuevo medicamento
router.get('/', medicamentoController.findAll); // Obtener todos los medicamentos
router.get('/:medicamentoId', medicamentoController.findOne); // Obtener un medicamento por su ID
router.patch('/:medicamentoId', medicamentoController.update); // Actualizar un medicamento por su ID (utilizando PATCH)
router.delete('/:medicamentoId', medicamentoController.delete); // Eliminar un medicamento por su ID

// Exportar el router
module.exports = router;
