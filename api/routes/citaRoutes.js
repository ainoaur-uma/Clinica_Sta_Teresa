const express = require('express');
const router = express.Router();

// Importar el controlador de cita
const citaController = require('../controllers/citaController');

// Definición de rutas para la entidad cita:
router.post('/', citaController.create); // Crea una nueva cita
router.get('/', citaController.findAll); // Obtiene todas las citas
router.get('/:idCita', citaController.findOne); // Obtiene una cita por su ID
router.get('/paciente/:NHC_paciente', citaController.findByNhc); // Busca citas por NHC del paciente
router.get('/doctor/:doctor_id', citaController.findByUsuarioId); // Busca citas por ID del doctor (usuario)
router.get('/agenda/:agenda_id', citaController.findByAgendaId); // Busca citas por ID de la agenda
router.get('/agenda/nombre/:nombreAgenda', citaController.findByNombreAgenda); // Busca citas por el nombre de la agenda
router.patch('/:idCita', citaController.updateById); // Actualiza una cita por su ID
router.delete('/:idCita', citaController.deleteById); // Elimina una cita por su ID

// Exportar el router
module.exports = router;
