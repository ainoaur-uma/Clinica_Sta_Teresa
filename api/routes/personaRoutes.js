const express = require('express');
const router = express.Router();

// Importa el controlador
const personaController = require('../controllers/personaController');

// Definir las rutas para la entidad persona:
router.post('/', personaController.create); // Crear una nueva persona
router.get('/', personaController.findAll); // Obtener todas las personas
router.get('/:personaId', personaController.findOne); // Obtener una persona por ID
router.get('/carnet/:carnetIdentidad', personaController.findByCarnet); // Buscar persona por carnet de identidad
router.get('/nombre/:nombre', personaController.findByNombre); // Buscar personas por nombre
router.get('/apellido1/:apellido1', personaController.findByApellido1); // Buscar personas por primer apellido
router.get('/apellido2/:apellido2', personaController.findByApellido2); // Buscar personas por segundo apellido
router.get('/ordenados/nombre', personaController.getAllSortedByName); // Obtener personas ordenadas por nombre
router.get('/ordenados/apellidos', personaController.getAllSortedByApellidos); // Obtener personas ordenadas por apellidos
router.patch('/:personaId', personaController.updateById); // Actualizar una persona por ID
router.delete('/:personaId', personaController.deleteById); // Eliminar una persona por ID

// Exportar el router
module.exports = router;
