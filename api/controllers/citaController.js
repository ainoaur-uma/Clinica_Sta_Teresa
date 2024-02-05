// Importar los modelos
const citaModel = require('../models/citaModel');
const pacienteModel = require('../models/pacienteModel');
const usuarioModel = require('../models/usuarioModel');
const agendaModel = require('../models/agendaModel');

// Validar los datos de la cita
const validarCita = (cita, isUpdating = false) => {
  const errores = [];
  if (!isUpdating) {
    // Validaciones para la creación (POST)
    if (!cita.NHC_paciente) {
      errores.push('El NHC del paciente es requerido.');
    }
    if (!cita.doctor_id) {
      errores.push('El ID del médico es requerido.');
    }
    if (!cita.agenda_id) {
      errores.push('El ID de la agenda es requerido.');
    }
  } else {
    // Validaciones para la actualización (PATCH)
    if ('NHC_paciente' in cita && !cita.NHC_paciente) {
      errores.push('El NHC del paciente no puede estar vacío.');
    }
    if ('doctor_id' in cita && !cita.doctor_id) {
      errores.push('El ID del médico no puede estar vacío.');
    }
    if ('agenda_id' in cita && !cita.agenda_id) {
      errores.push('El ID de la agenda no puede estar vacío.');
    }
  }
  return errores;
};

// Verificar la existencia del paciente, médico y agenda
const verificarExistenciaPacienteMedicoAgenda = (
  nhc,
  doctorId,
  agendaId,
  callback
) => {
  pacienteModel.findById(nhc, (err, paciente) => {
    if (err || !paciente) {
      callback({ tipo: 'Paciente no encontrado', nhc }, null);
      return;
    }

    usuarioModel.findById(doctorId, (err, medico) => {
      if (err || !medico) {
        callback({ tipo: 'Médico no encontrado', idMedico: doctorId }, null);
        return;
      }

      agendaModel.findById(agendaId, (err, agenda) => {
        if (err || !agenda) {
          callback({ tipo: 'Agenda no encontrada', idAgenda: agendaId }, null);
          return;
        }

        callback(null, { paciente, medico, agenda });
      });
    });
  });
};

// Crear una nueva cita
exports.create = (req, res) => {
  const nuevaCita = {
    fecha: req.body.fecha,
    hora: req.body.hora,
    NHC_paciente: req.body.NHC_paciente,
    doctor_id: req.body.doctor_id,
    agenda_id: req.body.agenda_id,
    informacion_cita: req.body.informacion_cita,
  };

  const errores = validarCita(nuevaCita);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  verificarExistenciaPacienteMedicoAgenda(
    nuevaCita.NHC_paciente,
    nuevaCita.doctor_id,
    nuevaCita.agenda_id,
    (err, result) => {
      if (err) {
        return res
          .status(404)
          .json({ mensaje: `Error: ${err.tipo}`, error: err });
      }

      citaModel.create(nuevaCita, (err, cita) => {
        if (err) {
          console.error('Error al crear cita:', err);
          return res
            .status(500)
            .json({ mensaje: 'Error al crear cita', error: err.sqlMessage });
        }
        res.status(201).json(cita);
      });
    }
  );
};

// Obtener todas las citas
exports.findAll = (req, res) => {
  citaModel.getAll((err, citas) => {
    if (err) {
      console.error('Error al obtener citas:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al obtener citas', error: err.sqlMessage });
    }
    res.status(200).json(citas);
  });
};

// Obtener una cita por su ID
exports.findOne = (req, res) => {
  const idCita = req.params.idCita;
  citaModel.findById(idCita, (err, cita) => {
    if (err) {
      console.error('Error al obtener cita:', err);
      return res
        .status(500)
        .json({
          mensaje: `Error al obtener cita con ID ${idCita}`,
          error: err.sqlMessage,
        });
    }
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.status(200).json(cita);
  });
};

// Obtener todas las citas de un paciente por su NHC
exports.findByPacienteNHC = (req, res) => {
  const nhc = req.params.NHC_paciente;
  citaModel.findByPacienteNHC(nhc, (err, citas) => {
    if (err) {
      console.error('Error al obtener citas por NHC del paciente:', err);
      return res
        .status(500)
        .json({
          mensaje: `Error al obtener citas para el NHC ${nhc}`,
          error: err.sqlMessage,
        });
    }
    if (citas.length === 0) {
      return res
        .status(404)
        .json({
          mensaje: `No se encontraron citas para el paciente con NHC ${nhc}`,
        });
    }
    res.status(200).json(citas);
  });
};

// Actualizar una cita por su ID
exports.update = (req, res) => {
  const idCita = req.params.idCita;
  const updatedData = req.body;

  verificarExistenciaPacienteMedicoAgenda(
    updatedData.NHC_paciente,
    updatedData.doctor_id,
    updatedData.agenda_id,
    (err, result) => {
      if (err) {
        return res
          .status(404)
          .json({ mensaje: `Error en los datos proporcionados`, error: err });
      }

      const errores = validarCita(updatedData, true);
      if (errores.length > 0) {
        return res
          .status(400)
          .json({ mensaje: 'Errores de validación', errores });
      }

      citaModel.updateById(idCita, updatedData, (err, result) => {
        if (err) {
          console.error('Error al actualizar cita:', err);
          return res
            .status(500)
            .json({
              mensaje: 'Error al actualizar cita',
              error: err.sqlMessage,
            });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }
        res.status(200).json({ mensaje: 'Cita actualizada exitosamente' });
      });
    }
  );
};

// Eliminar una cita por su ID
exports.delete = (req, res) => {
  const idCita = req.params.idCita;
  citaModel.removeById(idCita, (err, result) => {
    if (err) {
      console.error('Error al eliminar cita:', err);
      return res
        .status(500)
        .json({
          mensaje: `Error al eliminar cita con ID ${idCita}`,
          error: err.sqlMessage,
        });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.status(200).json({ mensaje: 'Cita eliminada exitosamente' });
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
