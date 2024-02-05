// Importar los modelos
const inventarioMedicamentosModel = require('../models/inventarioMedicamentosModel');
const medicamentoModel = require('../models/medicamentoModel');

// Validar los datos del inventario de medicamentos
const validarInventario = (inventario, isUpdating = false) => {
  const errores = [];
  if (!isUpdating) {
    // Validación para operaciones POST (creación)
    if (!inventario.idMedicamento) {
      errores.push('El ID del medicamento es requerido.');
    }
    if (inventario.cantidad_actual == null) {
      errores.push('La cantidad actual es requerida.');
    }
    if (!inventario.fecha_registro) {
      errores.push('La fecha de registro es requerida.');
    }
  } else {
    // Validación para operaciones PATCH (actualización)
    if ('cantidad_actual' in inventario && inventario.cantidad_actual == null) {
      errores.push('La cantidad actual no puede estar vacía.');
    }
    if ('fecha_registro' in inventario && !inventario.fecha_registro) {
      errores.push('La fecha de registro no puede estar vacía.');
    }
  }
  return errores;
};

// Verificar la existencia del medicamento por idMedicamento
const verificarExistenciaMedicamento = (idMedicamento, callback) => {
  medicamentoModel.findById(idMedicamento, (err, res) => {
    if (err) {
      callback(err, null);
    } else if (!res) {
      callback({ tipo: 'Medicamento no encontrado', idMedicamento }, null);
    } else {
      callback(null, res);
    }
  });
};

// Controlador para crear un nuevo inventario de medicamentos
exports.create = (req, res) => {
  const nuevoInventario = {
    idMedicamento: req.body.idMedicamento,
    cantidad_actual: req.body.cantidad_actual,
    fecha_registro: req.body.fecha_registro,
  };
  const errores = validarInventario(nuevoInventario);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaMedicamento(
    nuevoInventario.idMedicamento,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          mensaje: `Medicamento con ID ${nuevoInventario.idMedicamento} no encontrado`,
          error: err.tipo,
        });
      }

      inventarioMedicamentosModel.create(nuevoInventario, (err, inventario) => {
        if (err) {
          console.error('Error al crear registro en inventario:', err);
          return res.status(500).json({
            mensaje: 'Error al crear registro en inventario',
            error: err.sqlMessage,
          });
        }
        res.status(201).json(inventario);
      });
    }
  );
};

// Controlador para obtener todos los registros del inventario
exports.findAll = (req, res) => {
  inventarioMedicamentosModel.getAll((err, inventarios) => {
    if (err) {
      console.error('Error al obtener inventario:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener inventario',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(inventarios);
  });
};

// Obtener los registros del inventario por ID de medicamento
exports.findOneByIdMedicamento = (req, res) => {
  const idMedicamento = req.params.idMedicamento;
  if (!idMedicamento) {
    return res
      .status(400)
      .json({ mensaje: 'ID de medicamento no proporcionado' });
  }

  inventarioMedicamentosModel.findByIdMedicamento(
    idMedicamento,
    (err, inventario) => {
      if (err) {
        console.error('Error al buscar en inventario:', err);
        return res.status(500).json({
          mensaje: 'Error al buscar en inventario',
          error: err.sqlMessage,
        });
      }
      if (!inventario) {
        return res
          .status(404)
          .json({ mensaje: 'Registro de inventario no encontrado' });
      }
      res.status(200).json(inventario);
    }
  );
};

// Controlador para obtener un registro del inventario por ID del inventario
exports.findOneByIdInventario = (req, res) => {
  const idInventario = req.params.idInventario;
  if (!idInventario) {
    return res
      .status(400)
      .json({ mensaje: 'ID del inventario no proporcionado' });
  }

  inventarioMedicamentosModel.findByIdInventario(
    idInventario,
    (err, inventario) => {
      if (err) {
        console.error('Error al buscar en inventario:', err);
        return res.status(500).json({
          mensaje: 'Error al buscar en inventario',
          error: err.sqlMessage,
        });
      }
      if (!inventario) {
        return res
          .status(404)
          .json({ mensaje: 'Registro de inventario no encontrado' });
      }
      res.status(200).json(inventario);
    }
  );
};

/**
 Controlador para actualizar un registro del inventario por ID del inventario: Primero, obtiene el registro existente del inventario para encontrar el idMedicamento asociado, como hay dos funciones 
  para obtener los medicamentos, por idInventario o por idMedicamento y en esta actualizacion queremos hacerlo por idMedicamento, utilizamosla funcion findByIdInventario
  **/
exports.updateByIdInventario = (req, res) => {
  const idInventario = req.params.idInventario;
  const updatedData = req.body;

  inventarioMedicamentosModel.findByIdInventario(
    idInventario,
    (err, inventarioExistente) => {
      if (err) {
        console.error('Error al buscar en inventario:', err);
        return res.status(500).json({
          mensaje: 'Error al buscar en inventario',
          error: err.sqlMessage,
        });
      }
      if (!inventarioExistente) {
        return res
          .status(404)
          .json({ mensaje: 'Registro de inventario no encontrado' });
      }

      // Ahora que se tiene el idMedicamento, se puede  verificar su existencia
      verificarExistenciaMedicamento(
        inventarioExistente.idMedicamento,
        (err, result) => {
          if (err) {
            return res.status(404).json({
              mensaje: `Medicamento con ID ${inventarioExistente.idMedicamento} no encontrado`,
              error: err.tipo,
            });
          }

          //  medicamento existe, se valida el inventario, isUpdating=true

          const errores = validarInventario(updatedData, true);
          if (errores.length > 0) {
            return res
              .status(400)
              .json({ mensaje: 'Errores de validación', errores });
          }

          inventarioMedicamentosModel.updateByIdInventario(
            idInventario,
            updatedData,
            (err, result) => {
              if (err) {
                console.error('Error al actualizar inventario:', err);
                return res.status(500).json({
                  mensaje: 'Error al actualizar inventario',
                  error: err.sqlMessage,
                });
              }
              if (result.affectedRows === 0) {
                return res
                  .status(404)
                  .json({ mensaje: 'Registro de inventario no encontrado' });
              }
              res.status(200).json({
                mensaje: `Inventario con ID ${idInventario} actualizado exitosamente`,
              });
            }
          );
        }
      );
    }
  );
};

//Eliminar un registro del inventario por ID del inventario
exports.deleteByIdInventario = (req, res) => {
  const idInventario = req.params.idInventario;

  inventarioMedicamentosModel.removeByIdInventario(
    idInventario,
    (err, result) => {
      if (err) {
        console.error('Error al eliminar registro del inventario:', err);
        return res.status(500).json({
          mensaje: `Error al eliminar registro del inventario con ID ${idInventario}`,
          error: err.sqlMessage,
        });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: 'Registro de inventario no encontrado' });
      }
      res.status(200).json({
        mensaje: `Registro de inventario con ID ${idInventario} eliminado exitosamente`,
      });
    }
  );
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOneByIdMedicamento: exports.findOneByIdMedicamento,
  findOneByIdInventario: exports.findOneByIdInventario,
  updateByIdInventario: exports.updateByIdInventario,
  deleteByIdInventario: exports.deleteByIdInventario,
};
