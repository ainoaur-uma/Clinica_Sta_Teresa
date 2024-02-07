const express = require('express');
const router = express.Router();

// Importar el controlador de episodios
const episodioController = require('../controllers/episodioController');

// Definición de rutas para la entidad Episodio:
router.post('/', episodioController.create); // Crear un nuevo episodio
router.get('/', episodioController.findAll); // Obtener todos los episodios
router.get('/:idEpisodio', episodioController.findOne); // Obtener un episodio por su ID
router.get('/paciente/:NHC_paciente', episodioController.findByNHC); // Obtener todos los episodios de un paciente por su NHC
router.patch('/:idEpisodio', episodioController.updateById); // Actualizar un episodio por su ID (utilizando PATCH)
router.delete('/:idEpisodio', episodioController.deleteById); // Eliminar un episodio por su ID

// Exportar el router
module.exports = router;
