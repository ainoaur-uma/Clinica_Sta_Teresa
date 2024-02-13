const express = require('express');
const router = express.Router();

// Importar el controlador
const pacienteController = require('../controllers/pacienteController');

// Definición de rutas para la entidad de paciente:
router.post('/', pacienteController.create); // Crear un nuevo paciente
router.get('/', pacienteController.findAll); // Obtener todos los pacientes
router.get('/listadetallada', pacienteController.getPatientDetails); // Obtener todos los pacientes con detalles extendidos
router.get('/:NHC', pacienteController.findOne); // Obtener un paciente por su NHC
router.get('/detalle/:NHC', pacienteController.findByNHCWithPersonaDetails); //Obtiene los datos personales del paciente por su NHC
router.patch('/:NHC', pacienteController.updateById); // Actualizar un paciente por su NHC (utilizando PATCH)
router.patch(
  '/updatePersonaYPaciente/:NHC',
  pacienteController.updatePersonaYPaciente
); // Ruta para actualizar tanto los datos personales como los del paciente
router.delete('/:NHC', pacienteController.deleteById); // Eliminar un paciente por su NHC

// Exportar el router
module.exports = router;
