// Importar los modelos
const recetaModel = require('../models/recetaModel');
const pacienteModel = require('../models/pacienteModel');
const medicamentoModel = require('../models/medicamentoModel');
const usuarioModel = require('../models/usuarioModel');

// Validar los datos de la receta
const validarReceta = (receta, isUpdating = false) => {
  const errores = [];
  if (!isUpdating) {
    // Validaciones para la creación (POST)
    if (!receta.nhc_paciente) {
      errores.push('El NHC del paciente es requerido.');
    }
    if (!receta.id_medicamento) {
      errores.push('El ID del medicamento es requerido.');
    }
    if (!receta.id_medico) {
      errores.push('El ID del médico es requerido.');
    }
  } else {
    // Validaciones para la actualización (PATCH)
    if ('nhc_paciente' in receta && !receta.nhc_paciente) {
      errores.push('El NHC del paciente no puede estar vacío.');
    }
    if ('id_medicamento' in receta && !receta.id_medicamento) {
      errores.push('El ID del medicamento no puede estar vacío.');
    }
    if ('id_medico' in receta && !receta.id_medico) {
      errores.push('El ID del médico no puede estar vacío.');
    }
  }
  return errores;
};

// Verificar la existencia del paciente, médico y medicamento
const verificarExistenciaPacienteMedicoMedicamento = (
  nhc,
  idMedico,
  idMedicamento,
  callback
) => {
  pacienteModel.findById(nhc, (err, paciente) => {
    if (err || !paciente) {
      callback({ tipo: 'Paciente no encontrado', nhc }, null);
      return;
    }
    usuarioModel.findById(idMedico, (err, medico) => {
      if (err || !medico) {
        callback({ tipo: 'Médico no encontrado', idMedico }, null);
        return;
      }
      medicamentoModel.findById(idMedicamento, (err, medicamento) => {
        if (err || !medicamento) {
          callback({ tipo: 'Medicamento no encontrado', idMedicamento }, null);
          return;
        }
        callback(null, { paciente, medico, medicamento });
      });
    });
  });
};

// Crear una nueva receta
exports.create = (req, res) => {
  const nuevaReceta = {
    nhc_paciente: req.body.nhc_paciente,
    id_medicamento: req.body.id_medicamento,
    id_medico: req.body.id_medico,
    fecha_receta: req.body.fecha_receta,
    recomendaciones: req.body.recomendaciones,
  };

  const errores = validarReceta(nuevaReceta);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaPacienteMedicoMedicamento(
    nuevaReceta.nhc_paciente,
    nuevaReceta.id_medico,
    nuevaReceta.id_medicamento,
    (err, result) => {
      if (err) {
        return res
          .status(404)
          .json({ mensaje: `Error: ${err.tipo}`, error: err });
      }

      recetaModel.create(nuevaReceta, (err, receta) => {
        if (err) {
          console.error('Error al crear receta:', err);
          return res
            .status(500)
            .json({ mensaje: 'Error al crear receta', error: err.sqlMessage });
        }
        res.status(201).json(receta);
      });
    }
  );
};

// Obtener todas las recetas
exports.findAll = (req, res) => {
  recetaModel.getAll((err, recetas) => {
    if (err) {
      console.error('Error al obtener recetas:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al obtener recetas', error: err.sqlMessage });
    }
    res.status(200).json(recetas);
  });
};

// Obtener una receta  específica por su ID
exports.findOne = (req, res) => {
  const idReceta = req.params.idReceta;
  recetaModel.findById(idReceta, (err, receta) => {
    if (err) {
      console.error('Error al obtener receta:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al obtener receta', error: err.sqlMessage });
    }
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.status(200).json(receta);
  });
};

// Obtener las  recetas por el NHC del paciente
exports.findByNhc = (req, res) => {
  const nhc = req.params.nhc_paciente;
  recetaModel.findByNhc(nhc, (err, recetas) => {
    if (err) {
      console.error('Error al obtener recetas por NHC del paciente:', err);
      return res.status(500).json({
        mensaje: `Error al obtener recetas para el NHC ${nhc}`,
        error: err.sqlMessage,
      });
    }
    if (recetas.length === 0) {
      return res.status(404).json({
        mensaje: `No se encontraron recetas para el paciente con NHC ${nhc}`,
      });
    }
    res.status(200).json(recetas);
  });
};

// Obtener una receta por el ID del medicamento
exports.findByMedicamentoId = (req, res) => {
  const idMedicamento = req.params.idMedicamento;
  recetaModel.findByMedicamentoId(idMedicamento, (err, recetas) => {
    if (err) {
      console.error('Error al obtener recetas por ID de medicamento:', err);
      return res.status(500).json({
        mensaje: `Error al obtener recetas para el medicamento ID ${idMedicamento}`,
        error: err.sqlMessage,
      });
    }
    if (recetas.length === 0) {
      return res.status(404).json({
        mensaje: `No se encontraron recetas para el medicamento ID ${idMedicamento}`,
      });
    }
    res.status(200).json(recetas);
  });
};

// Actualizar una receta por su ID
exports.update = (req, res) => {
  const idReceta = req.params.idReceta;
  const updatedData = req.body;

  // Verificación de la existencia de los elementos involucrados
  verificarExistenciaPacienteMedicoMedicamento(
    updatedData.nhc_paciente,
    updatedData.id_medico,
    updatedData.id_medicamento,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          mensaje: `Error en los datos proporcionados`,
          error: err,
        });
      }

      const errores = validarReceta(updatedData, true);
      if (errores.length > 0) {
        return res
          .status(400)
          .json({ mensaje: 'Errores de validación', errores });
      }

      recetaModel.updateById(idReceta, updatedData, (err, result) => {
        if (err) {
          console.error('Error al actualizar receta:', err);
          return res.status(500).json({
            mensaje: 'Error al actualizar receta',
            error: err.sqlMessage,
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }
        res.status(200).json({ mensaje: 'Receta actualizada exitosamente' });
      });
    }
  );
};

// Eliminar una receta por su ID
exports.delete = (req, res) => {
  const idReceta = req.params.idReceta;
  recetaModel.remove(idReceta, (err, result) => {
    if (err) {
      console.error('Error al eliminar receta:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al eliminar receta', error: err.sqlMessage });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.status(200).json({ mensaje: 'Receta eliminada exitosamente' });
  });
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  delete: exports.delete,
  findByNhc: exports.findByNhc,
  findByMedicamentoId: exports.findByMedicamentoId,
};
