const express = require('express');
const router = express.Router();

// Importar el controlador de cita
const citaController = require('../controllers/citaController');

// Definición de rutas para la entidad cita:
router.post('/', citaController.create); // Crear una nueva cita
router.get('/', citaController.findAll); // Obtener todas las citas
router.get('/:idCita', citaController.findOne); // Obtener una cita específica por su ID
router.get('/paciente/:NHC_paciente', citaController.findByPacienteNHC); // Obtener citas por NHC del paciente
router.patch('/:idCita', citaController.update); // Actualizar una cita por su ID (utilizando PATCH)
router.delete('/:idCita', citaController.delete); // Eliminar una cita por su ID

// Exportar el router
module.exports = router;
