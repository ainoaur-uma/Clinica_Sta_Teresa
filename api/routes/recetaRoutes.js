const express = require('express');
const router = express.Router();

// Importar el controlador de receta
const recetaController = require('../controllers/recetaController');

// Definición de rutas para la entidad receta:
router.post('/', recetaController.create); // Crear una nueva receta
router.get('/', recetaController.findAll); // Obtener todas las recetas
router.get('/:idReceta', recetaController.findOne); // Obtener una receta específica por su ID
router.get('/paciente/:nhc_paciente', recetaController.findByNhc); // Obtener recetas por NHC del paciente
router.get('/medicamento/:idMedicamento', recetaController.findByMedicamentoId); // Obtener recetas por ID del medicamento
router.patch('/:idReceta', recetaController.update); // Actualizar una receta por su ID (utilizando PATCH)
router.delete('/:idReceta', recetaController.delete); // Eliminar una receta por su ID

// Exportar el router
module.exports = router;
