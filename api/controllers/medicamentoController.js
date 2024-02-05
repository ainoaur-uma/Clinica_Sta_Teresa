// Importar el modelo
const medicamentoModel = require('../models/medicamentoModel');

// Validar los datos del medicamento
const validarMedicamento = (medicamento) => {
  const errores = [];
  if (!medicamento.nombre_medicamento) {
    errores.push('El nombre del medicamento es requerido.');
  }
  return errores;
};

// Crea un nuevo medicamento:
exports.create = (req, res) => {
  const nuevoMedicamento = {
    nombre_medicamento: req.body.nombre_medicamento,
    principio_activo: req.body.principio_activo,
    descripcion_medicamento: req.body.descripcion_medicamento,
    fecha_caducidad: req.body.fecha_caducidad,
    forma_dispensacion: req.body.forma_dispensacion,
  };
  const errores = validarMedicamento(nuevoMedicamento);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  medicamentoModel.create(nuevoMedicamento, (err, medicamento) => {
    if (err) {
      let mensajeError = 'Error al crear el medicamento';
      if (err.code === 'ER_DUP_ENTRY') {
        mensajeError = 'El medicamento ya existe';
      }
      return res
        .status(500)
        .json({ mensaje: mensajeError, error: err.sqlMessage });
    }
    res.status(201).json(medicamento);
  });
};

// Obtiene todos los medicamentos de la base de datos
exports.findAll = (req, res) => {
  medicamentoModel.getAll((err, medicamentos) => {
    if (err) {
      console.error('Error al obtener todos los medicamentos:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener todos los medicamentos',
        error: err.sqlMessage,
      });
    }
    return res.status(200).json(medicamentos);
  });
};

// Obtiene un medicamento por su ID
exports.findOne = (req, res) => {
  const medicamentoId = req.params.medicamentoId;
  if (!medicamentoId) {
    return res
      .status(400)
      .json({ mensaje: 'ID de medicamento no proporcionado' });
  }

  medicamentoModel.findById(medicamentoId, (err, medicamento) => {
    if (err) {
      console.error('Error al obtener el medicamento por su ID:', err);
      return res.status(500).json({
        tipo: 'Error en la consulta',
        mensaje: `Error al obtener el medicamento con ID ${medicamentoId}`,
        error: err.sqlMessage,
      });
    }
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    return res.status(200).json(medicamento);
  });
};

// Actualiza un medicamento por su ID utilizando PATCH
exports.update = (req, res) => {
  const medicamentoId = req.params.medicamentoId;
  const updatedData = req.body;
  const errores = validarMedicamento(updatedData);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }
  medicamentoModel.updateById(medicamentoId, updatedData, (err, result) => {
    if (err) {
      console.error('Error al actualizar el medicamento por su ID:', err);
      return res.status(500).json({
        mensaje: 'Error al actualizar el medicamento por su ID',
        error: err.sqlMessage,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    return res.status(200).json({
      mensaje: `Medicamento con ID ${medicamentoId} actualizado exitosamente`,
    });
  });
};

// Elimina un medicamento por su ID
exports.delete = (req, res) => {
  const medicamentoId = req.params.medicamentoId;

  medicamentoModel.remove(medicamentoId, (err, result) => {
    if (err) {
      console.error('Error al eliminar el medicamento por su ID:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar el medicamento con ID ${medicamentoId}`,
        error: err.sqlMessage,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    return res.status(200).json({
      mensaje: `Medicamento con ID ${medicamentoId}eliminado exitosamente`,
    });
  });
};

// Exportamos las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  delete: exports.delete,
};
