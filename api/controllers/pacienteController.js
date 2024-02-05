// Importar los modelos
const pacienteModel = require('../models/pacienteModel');
const personaModel = require('../models/personaModel');

// Validar los datos del paciente
const validarPaciente = (paciente, isUpdating = false) => {
  const errores = [];
  if (!isUpdating) {
    // Validación para operaciones POST
    if (!paciente.NHC) {
      errores.push('El NHC del paciente es requerido.');
    }
  }
  return errores;
};

// Verificar la existencia de la persona asociada al NHC del paciente
const verificarExistenciaPersona = (NHC, callback) => {
  personaModel.findById(NHC, (err, res) => {
    if (err) {
      callback(err, null);
    } else if (!res) {
      callback({ tipo: 'Persona no encontrada', idPersona: NHC }, null);
    } else {
      callback(null, res);
    }
  });
};

// Crear un nuevo paciente
exports.create = (req, res) => {
  const nuevoPaciente = {
    NH_paciente: req.body.NH_paciente,
    tutor_info: req.body.tutor_info,
    grado: req.body.grado,
    otra_info: req.body.otra_info,
  };

  const errores = validarPaciente(nuevoPaciente);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaPersona(nuevoPaciente.NHC, (err, result) => {
    if (err) {
      return res.status(404).json({
        mensaje: `Persona con NHC ${nuevoPaciente.NHC} no encontrada`,
        error: err.tipo,
      });
    }

    pacienteModel.create(nuevoPaciente, (err, paciente) => {
      if (err) {
        console.error('Error al crear paciente:', err);
        return res.status(500).json({
          mensaje: 'Error al crear paciente',
          error: err.sqlMessage,
        });
      }
      res.status(201).json(paciente);
    });
  });
};

// Obtener todos los pacientes
exports.findAll = (req, res) => {
  pacienteModel.getAll((err, pacientes) => {
    if (err) {
      console.error('Error al obtener pacientes:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener pacientes',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(pacientes);
  });
};

// Obtener un paciente por su NHC
exports.findOne = (req, res) => {
  const NHC = req.params.NHC;
  pacienteModel.findById(NHC, (err, paciente) => {
    if (err) {
      console.error('Error al obtener paciente:', err);
      return res.status(500).json({
        mensaje: `Error al obtener paciente con NHC ${NHC}`,
        error: err.sqlMessage,
      });
    }
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.status(200).json(paciente);
  });
};

// Actualizar un paciente por su NHC
exports.update = (req, res) => {
  const NHC = req.params.NHC;
  const updatedData = req.body;

  verificarExistenciaPersona(NHC, (err, result) => {
    if (err) {
      return res.status(404).json({
        mensaje: `Persona con NHC ${NHC} no encontrada`,
        error: err.tipo,
      });
    }

    const errores = validarPaciente(updatedData, true);
    if (errores.length > 0) {
      return res
        .status(400)
        .json({ mensaje: 'Errores de validación', errores });
    }

    pacienteModel.updateById(NHC, updatedData, (err, result) => {
      if (err) {
        console.error('Error al actualizar paciente:', err);
        return res.status(500).json({
          mensaje: 'Error al actualizar paciente',
          error: err.sqlMessage,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' });
      }
      res.status(200).json({
        mensaje: `Paciente con NHC ${NHC} actualizado exitosamente`,
      });
    });
  });
};

// Eliminar un paciente por su NHC
exports.delete = (req, res) => {
  const NHC = req.params.NHC;
  pacienteModel.remove(NHC, (err, result) => {
    if (err) {
      console.error('Error al eliminar paciente:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar paciente con NHC ${NHC}`,
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.status(200).json({
      mensaje: `Paciente con NHC ${NHC} eliminado exitosamente`,
    });
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
