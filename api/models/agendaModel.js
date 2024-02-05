// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Definir el modelo para la entidad de agenda
const agendaModel = function (agenda) {
  this.idAgenda = agenda.idAgenda;
  this.descripcion = agenda.descripcion;
  this.horario = agenda.horario;
};

// Crea una nueva agenda
agendaModel.create = (nuevaAgenda, resultado) => {
  db.query('INSERT INTO agenda SET ?', nuevaAgenda, (err, res) => {
    if (err) {
      console.error('Error al crear la agenda:', err);
      resultado(
        {
          error: 'Error al crear la agenda',
          detalles: err.sqlMessage,
        },
        null
      );
      return;
    }
    resultado(null, { idAgenda: res.insertId, ...nuevaAgenda });
  });
};

// Obtiene todas las agendas
agendaModel.getAll = (resultado) => {
  db.query('SELECT * FROM agenda', (err, res) => {
    if (err) {
      console.error('Error al obtener las agendas:', err);
      resultado(
        { error: 'Error al obtener medicamentos', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene una agenda por su ID
agendaModel.findById = (agendaId, resultado) => {
  db.query(
    'SELECT * FROM agenda WHERE idAgenda = ?',
    [agendaId],
    (err, res) => {
      if (err) {
        console.error('Error al buscar la agenda:', err);
        resultado(
          { error: 'Error al buscar la agenda', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Agenda no encontrada' }, null);
      }
    }
  );
};

// Actualiza una agenda por su ID
agendaModel.updateById = (id, agenda, resultado) => {
  const updateFields = {};
  if ('descripcion' in agenda) updateFields.descripcion = agenda.descripcion;
  if ('horario' in agenda) updateFields.horario = agenda.horario;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE agenda SET ? WHERE idAgenda = ?',
    [updateFields, id],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar la agenda:', err);
        resultado(
          {
            error: 'Error al actualizar la agenda',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Agenda no encontrada' }, null);
      } else {
        resultado(null, { idAgenda: id, ...updateFields });
      }
    }
  );
};

// Elimina una agenda por su ID
agendaModel.remove = (id, resultado) => {
  db.query('DELETE FROM agenda WHERE idAgenda = ?', id, (err, res) => {
    if (err) {
      console.error('Error al eliminar la agenda:', err);
      resultado(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      resultado({ tipo: 'Agenda no encontrada' }, null);
    } else {
      resultado(null, res);
    }
  });
};

// Exportar el modelo
module.exports = agendaModel;
