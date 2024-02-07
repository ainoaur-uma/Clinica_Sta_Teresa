const express = require('express');
const router = express.Router();

// Importar el controlador de inventario de medicamentos
const inventarioMedicamentosController = require('../controllers/inventarioMedicamentosController');

// Rutas para la entidad Inventario de Medicamentos
router.post('/', inventarioMedicamentosController.create); // Crear un nuevo registro de inventario
router.get('/', inventarioMedicamentosController.findAll); // Obtener todos los registros de inventario
router.get('/:idInventario', inventarioMedicamentosController.findOne); // Obtener un registro de inventario por su ID
router.get(
  '/medicamento/:idMedicamento',
  inventarioMedicamentosController.findByMedicamentoId
); // Obtener registros de inventario por ID de medicamento
router.patch('/:idInventario', inventarioMedicamentosController.updateById); // Actualizar un registro de inventario por su ID
router.delete('/:idInventario', inventarioMedicamentosController.deleteById); // Eliminar un registro de inventario por su ID

// Exportar el router
module.exports = router;
