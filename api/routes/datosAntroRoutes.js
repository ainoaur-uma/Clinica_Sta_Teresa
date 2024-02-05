const express = require('express');
const router = express.Router();

// Importar el controlador de Datos Antropométricos
const datosAntroController = require('../controllers/datosAntroController');

// Definición de rutas para la entidad Datos Antropométricos:
router.post('/', datosAntroController.create); // Crear un nuevo registro de datos antropométricos
router.get('/', datosAntroController.findAll); // Obtener todos los registros de datos antropométricos
router.get('/:idDatoAntropometrico', datosAntroController.findOne); // Obtener un registro de datos antropométricos por su ID
router.get('/paciente/:NHC_paciente', datosAntroController.findByPacienteNHC); // Obtener todos los registros de un paciente por su NHC
router.patch('/:idDatoAntropometrico', datosAntroController.update); // Actualizar un registro de datos antropométricos por su ID (utilizando PATCH)
router.delete('/:idDatoAntropometrico', datosAntroController.delete); // Eliminar un registro de datos antropométricos por su ID

// Exportar el router
module.exports = router;
