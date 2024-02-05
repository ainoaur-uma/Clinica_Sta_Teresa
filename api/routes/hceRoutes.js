const express = require('express');
const router = express.Router();

// Importar el controlador de HCE
const hceController = require('../controllers/hceController');

// Definición de rutas para la entidad HCE:
router.post('/', hceController.create); // Crear una nueva HCE
router.get('/', hceController.findAll); // Obtener todas las HCEs
router.get('/:NHC_paciente', hceController.findOne); // Obtener una HCE por NHC del paciente
router.patch('/:NHC_paciente', hceController.update); // Actualizar una HCE por NHC del paciente (utilizando PATCH)
router.delete('/:NHC_paciente', hceController.delete); // Eliminar una HCE por NHC del paciente

// Exportar el router
module.exports = router;
