const express = require('express');
const router = express.Router();

// Importar el controlador
const pacienteController = require('../controllers/pacienteController');

// Definición de rutas para la entidad de paciente:
router.post('/', pacienteController.create); // Crear un nuevo paciente
router.get('/', pacienteController.findAll); // Obtener todos los pacientes
router.get('/:NHC', pacienteController.findOne); // Obtener un paciente por su NHC
router.patch('/:NHC', pacienteController.update); // Actualizar un paciente por su NHC (utilizando PATCH)
router.delete('/:NHC', pacienteController.delete); // Eliminar un paciente por su NHC

// Exportar el router
module.exports = router;
