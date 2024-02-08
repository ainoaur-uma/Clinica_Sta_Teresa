const express = require('express');
const router = express.Router();

// Importar el controlador
const agendaController = require('../controllers/agendaController');

// Definición de rutas para la entidad agenda:
router.post('/', agendaController.create); // Crea una nueva entrada en la agenda
router.get('/', agendaController.findAll); // Obtiene todas las entradas de la agenda
router.get('/:idAgenda', agendaController.findOne); // Obtiene una entrada de la agenda por su ID
router.get('/descripcion/:descripcion', agendaController.findByDescripcion); // Busca agendas por descripción
router.patch('/:idAgenda', agendaController.updateById); // Actualiza una entrada en la agenda por su ID
router.delete('/:idAgenda', agendaController.deleteById); // Elimina una entrada en la agenda por su ID

// Exportar el router
module.exports = router;
