const express = require('express');
const router = express.Router();

// Importar el controlador
const inventarioMedicamentosController = require('../controllers/inventarioMedicamentosController');

// Definición de rutas para la entidad de inventario de medicamentos:
router.post('/', inventarioMedicamentosController.create); // Crear un nuevo registro en el inventario
router.get('/', inventarioMedicamentosController.findAll); // Obtener todos los registros del inventario

// Rutas que dependen de idMedicamento
router.get(
  '/medicamento/:idMedicamento',
  inventarioMedicamentosController.findOneByIdMedicamento
); // Obtener un registro del inventario por ID de medicamento

// Rutas que dependen de idInventario
router.get(
  '/inventario/:idInventario',
  inventarioMedicamentosController.findOneByIdInventario
); // Obtener un registro del inventario por ID del inventario
router.patch(
  '/inventario/:idInventario',
  inventarioMedicamentosController.updateByIdInventario
); // Actualizar un registro del inventario por ID del inventario
router.delete(
  '/inventario/:idInventario',
  inventarioMedicamentosController.deleteByIdInventario
); // Eliminar un registro del inventario por ID del inventario

// Exportar el router
module.exports = router;
