// Importar los modelos
const hceModel = require('../models/hceModel');
const pacienteModel = require('../models/pacienteModel');
const personaModel = require('../models/personaModel');

// Validar los datos de la HCE
const validarHce = (hce, isUpdating = false) => {
  const errores = [];
  if (!isUpdating) {
    if (!hce.NHC_paciente) {
      errores.push('El NHC del paciente es requerido.');
    }
  }
  return errores;
};

// Verificar la existencia del paciente y su correspondiente persona
const verificarExistenciaPacientePersona = (nhc, callback) => {
  // Primero verifica si la persona existe
  personaModel.findById(nhc, (err, persona) => {
    if (err || !persona) {
      callback({ tipo: 'Persona no encontrada', idPersona: nhc }, null);
      return;
    }

    // Si la persona existe, verifica si es un paciente
    pacienteModel.findById(nhc, (err, paciente) => {
      if (err || !paciente) {
        callback({ tipo: 'Paciente no encontrado', nhc }, null);
        return;
      }
      callback(null, { paciente, persona });
    });
  });
};

// Crear una nueva HCE
exports.create = (req, res) => {
  const nuevaHce = {
    NHC_paciente: req.body.NHC_paciente,
    sexo: req.body.sexo,
    grupo_sanguineo: req.body.grupo_sanguineo,
    alergias: req.body.alergias,
    antecedentes_clinicos: req.body.antecedentes_clinicos,
  };

  const errores = validarHce(nuevaHce);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaPacientePersona(nuevaHce.NHC_paciente, (err, result) => {
    if (err) {
      return res.status(404).json({
        mensaje: `Error al verificar existencia del Paciente con NHC ${nuevaHce.NHC_paciente}`,
        error: err,
      });
    }

    hceModel.create(nuevaHce, (err, hce) => {
      if (err) {
        console.error('Error al crear HCE:', err);
        return res.status(500).json({
          mensaje: 'Error al crear HCE',
          error: err.sqlMessage,
        });
      }
      res.status(201).json(hce);
    });
  });
};

// Obtener todas las HCE
exports.findAll = (req, res) => {
  hceModel.getAll((err, hces) => {
    if (err) {
      console.error('Error al obtener HCE:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener HCE',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(hces);
  });
};

// Obtener una HCE por NHC del paciente
exports.findOne = (req, res) => {
  const nhc = req.params.NHC_paciente;
  hceModel.findByNHC(nhc, (err, hce) => {
    if (err) {
      console.error('Error al obtener HCE:', err);
      return res.status(500).json({
        mensaje: `Error al obtener HCE para el NHC ${nhc}`,
        error: err.sqlMessage,
      });
    }
    if (!hce) {
      return res.status(404).json({ mensaje: 'HCE no encontrada' });
    }
    res.status(200).json(hce);
  });
};

// Actualizar una HCE por NHC del paciente
exports.update = (req, res) => {
  const nhc = req.params.NHC_paciente;
  const updatedData = req.body;

  verificarExistenciaPacientePersona(nhc, (err, result) => {
    if (err) {
      return res.status(404).json({
        mensaje: `Paciente con NHC ${nhc} no encontrado`,
        error: err.tipo,
      });
    }

    const errores = validarHce(updatedData, true);
    if (errores.length > 0) {
      return res
        .status(400)
        .json({ mensaje: 'Errores de validación', errores });
    }

    hceModel.updateByNHC(nhc, updatedData, (err, result) => {
      if (err) {
        console.error('Error al actualizar HCE:', err);
        return res.status(500).json({
          mensaje: 'Error al actualizar HCE',
          error: err.sqlMessage,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'HCE no encontrada' });
      }
      res.status(200).json({ mensaje: `HCE actualizada exitosamente` });
    });
  });
};

// Eliminar una HCE por NHC del paciente
exports.delete = (req, res) => {
  const nhc = req.params.NHC_paciente;
  hceModel.remove(nhc, (err, result) => {
    if (err) {
      console.error('Error al eliminar HCE:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar HCE del paciente `,
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'HCE no encontrada' });
    }
    res.status(200).json({ mensaje: `HCE eliminada exitosamente` });
  });
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  delete: exports.delete,
};
