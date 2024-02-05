const express = require('express');
const router = express.Router();

// Importar el controlador
const agendaController = require('../controllers/agendaController');

// Definición de rutas para la entidad agenda:
router.post('/', agendaController.create); // Crear una nueva agenda
router.get('/', agendaController.findAll); // Obtener todas las agendas
router.get('/:idAgenda', agendaController.findOne); // Obtener una agenda por su ID
router.patch('/:idAgenda', agendaController.update); // Actualizar una agenda por su ID (utilizando PATCH)
router.delete('/:idAgenda', agendaController.delete); // Eliminar una agenda por su ID

// Exportar el router
module.exports = router;
