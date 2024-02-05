const db = require('../../server/db_connection');

// Define el modelo para la entidad de cita
const citaModel = function (cita) {
  this.idCita = cita.idCita;
  this.fecha = cita.fecha;
  this.hora = cita.hora;
  this.NHC_paciente = cita.NHC_paciente;
  this.doctor_id = cita.doctor_id;
  this.agenda_id = cita.agenda_id;
  this.informacion_cita = cita.informacion_cita;
};

// Crea una nueva cita
citaModel.create = (nuevaCita, resultado) => {
  db.query('INSERT INTO cita SET ?', nuevaCita, (err, res) => {
    if (err) {
      console.error('Error al crear la cita:', err);
      resultado(
        { error: 'Error al crear cita', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { idCita: res.insertId, ...nuevaCita });
  });
};

// Obtiene todas las citas
citaModel.getAll = (resultado) => {
  db.query('SELECT * FROM cita', (err, res) => {
    if (err) {
      console.error('Error al obtener citas:', err);
      resultado(
        { error: 'Error al obtener citas', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene una cita por su ID
citaModel.findById = (idCita, resultado) => {
  db.query('SELECT * FROM cita WHERE idCita = ?', [idCita], (err, res) => {
    if (err) {
      console.error('Error al buscar la cita:', err);
      resultado(
        { error: 'Error al buscar cita', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.length) {
      resultado(null, res[0]);
    } else {
      resultado({ tipo: 'Cita no encontrada' }, null);
    }
  });
};

// Obtiene todas las citas de un paciente por su NHC
citaModel.findByPacienteNHC = (NHC_paciente, resultado) => {
  db.query(
    'SELECT * FROM cita WHERE NHC_paciente = ?',
    [NHC_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al buscar citas por NHC del paciente:', err);
        resultado(
          { error: 'Error al buscar citas por NHC', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res);
      } else {
        resultado({ tipo: 'No se encontraron citas para el paciente' }, null);
      }
    }
  );
};

// Actualiza una cita por su ID
citaModel.updateById = (id, cita, resultado) => {
  const updateFields = {};
  if ('fecha' in cita) updateFields.fecha = cita.fecha;
  if ('hora' in cita) updateFields.hora = cita.hora;
  if ('NHC_paciente' in cita) updateFields.NHC_paciente = cita.NHC_paciente;
  if ('doctor_id' in cita) updateFields.doctor_id = cita.doctor_id;
  if ('agenda_id' in cita) updateFields.agenda_id = cita.agenda_id;
  if ('informacion_cita' in cita)
    updateFields.informacion_cita = cita.informacion_cita;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE cita SET ? WHERE idCita = ?',
    [updateFields, id],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar la cita:', err);
        resultado(
          { error: 'Error al actualizar cita', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Cita no encontrada' }, null);
      } else {
        resultado(null, { idCita: id, ...updateFields });
      }
    }
  );
};

// Elimina una cita por su ID
citaModel.remove = (id, resultado) => {
  db.query('DELETE FROM cita WHERE idCita = ?', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar la cita:', err);
      resultado(
        { error: 'Error al eliminar cita', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.affectedRows === 0) {
      resultado({ tipo: 'Cita no encontrada' }, null);
    } else {
      resultado(null, res);
    }
  });
};

// Exportar el modelo
module.exports = citaModel;
