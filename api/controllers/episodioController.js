// Importar los modelos
const episodioModel = require('../models/episodioModel');
const pacienteModel = require('../models/pacienteModel');
const usuarioModel = require('../models/usuarioModel');

// Validar los datos del episodio
const validarEpisodio = (episodio, isUpdating = false) => {
  const errores = [];

  // Validaciones para la creación (POST)
  if (!isUpdating) {
    if (!episodio.NHC_paciente) {
      errores.push('El NHC del paciente es requerido.');
    }
    if (!episodio.Medico) {
      errores.push('El ID del médico es requerido.');
    }
  } else {
    // Validaciones para la actualización (PATCH)
    if ('NHC_paciente' in episodio && !episodio.NHC_paciente) {
      errores.push('El NHC del paciente no puede estar vacío.');
    }
    if ('Medico' in episodio && !episodio.Medico) {
      errores.push('El ID del médico no puede estar vacío.');
    }
  }

  return errores;
};

// Verificar la existencia del paciente y del médico
const verificarExistenciaPacienteMedico = (nhc, medicoId, callback) => {
  pacienteModel.findById(nhc, (err, paciente) => {
    if (err || !paciente) {
      callback({ tipo: 'Paciente no encontrado', nhc }, null);
      return;
    }

    usuarioModel.findById(medicoId, (err, medico) => {
      if (err || !medico) {
        callback({ tipo: 'Médico no encontrado', idMedico: medicoId }, null);
        return;
      }
      callback(null, { paciente, medico });
    });
  });
};

// Crear un nuevo episodio
exports.create = (req, res) => {
  const nuevoEpisodio = {
    NHC_paciente: req.body.NHC_paciente,
    Medico: req.body.Medico,
    fecha_episodio: req.body.fecha_episodio,
    tipo_asistencia: req.body.tipo_asistencia,
    motivo_consulta: req.body.motivo_consulta,
    anamnesis: req.body.anamnesis,
    diagnostico: req.body.diagnostico,
    tratamiento: req.body.tratamiento,
    peso: req.body.peso,
    pa: req.body.pa,
    spo2: req.body.spo2,
  };

  const errores = validarEpisodio(nuevoEpisodio);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaPacienteMedico(
    nuevoEpisodio.NHC_paciente,
    nuevoEpisodio.Medico,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          mensaje: `Error al verificar existencia del Paciente o Médico`,
          error: err,
        });
      }

      episodioModel.create(nuevoEpisodio, (err, episodio) => {
        if (err) {
          console.error('Error al crear episodio:', err);
          return res.status(500).json({
            mensaje: 'Error al crear episodio',
            error: err.sqlMessage,
          });
        }
        res.status(201).json(episodio);
      });
    }
  );
};

// Obtener todos los episodios
exports.findAll = (req, res) => {
  episodioModel.getAll((err, episodios) => {
    if (err) {
      console.error('Error al obtener episodios:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener episodios',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(episodios);
  });
};

// Obtener un episodio por su ID
exports.findOne = (req, res) => {
  const idEpisodio = req.params.idEpisodio;
  episodioModel.findById(idEpisodio, (err, episodio) => {
    if (err) {
      console.error('Error al obtener episodio:', err);
      return res.status(500).json({
        mensaje: `Error al obtener episodio con ID ${idEpisodio}`,
        error: err.sqlMessage,
      });
    }
    if (!episodio) {
      return res.status(404).json({ mensaje: 'Episodio no encontrado' });
    }
    res.status(200).json(episodio);
  });
};

// Obtener todos los episodios de un paciente por su NHC
exports.findByPacienteNHC = (req, res) => {
  const nhc = req.params.NHC_paciente;

  episodioModel.findByPacienteNHC(nhc, (err, episodios) => {
    if (err) {
      console.error(
        'Error al obtener episodios para el paciente con NHC:',
        nhc,
        err
      );
      return res.status(500).json({
        mensaje: `Error al obtener episodios para el paciente con NHC ${nhc}`,
        error: err.sqlMessage,
      });
    }
    if (episodios.length === 0) {
      return res
        .status(404)
        .json({ mensaje: 'No se encontraron episodios para el paciente' });
    }
    res.status(200).json(episodios);
  });
};

// Actualizar un episodio por su ID
exports.update = (req, res) => {
  const idEpisodio = req.params.idEpisodio;
  const updatedData = req.body;

  verificarExistenciaPacienteMedico(
    updatedData.NHC_paciente,
    updatedData.Medico,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          mensaje: `Error al verificar existencia del Paciente o Médico`,
          error: err,
        });
      }

      const errores = validarEpisodio(updatedData, true);
      if (errores.length > 0) {
        return res
          .status(400)
          .json({ mensaje: 'Errores de validación', errores });
      }

      episodioModel.updateById(idEpisodio, updatedData, (err, result) => {
        if (err) {
          console.error('Error al actualizar episodio:', err);
          return res.status(500).json({
            mensaje: 'Error al actualizar episodio',
            error: err.sqlMessage,
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ mensaje: 'Episodio no encontrado' });
        }
        res.status(200).json({ mensaje: `Episodio actualizado exitosamente` });
      });
    }
  );
};

// Eliminar un episodio por su ID
exports.delete = (req, res) => {
  const idEpisodio = req.params.idEpisodio;
  episodioModel.removeById(idEpisodio, (err, result) => {
    if (err) {
      console.error('Error al eliminar episodio:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar episodio con ID ${idEpisodio}`,
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Episodio no encontrado' });
    }
    res.status(200).json({ mensaje: `Episodio eliminado exitosamente` });
  });
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  findByPacienteNHC: exports.findByPacienteNHC,
  update: exports.update,
  delete: exports.delete,
};
