// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Define el modelo para la entidad de receta
const recetaModel = function (receta) {
  this.idReceta = receta.idReceta;
  this.nhc_paciente = receta.nhc_paciente;
  this.id_medicamento = receta.id_medicamento;
  this.id_medico = receta.id_medico;
  this.fecha_receta = receta.fecha_receta;
  this.recomendaciones = receta.recomendaciones;
};

// Crea una nueva receta
recetaModel.create = (nuevaReceta, resultado) => {
  db.query('INSERT INTO receta SET ?', nuevaReceta, (err, res) => {
    if (err) {
      console.error('Error al crear la receta:', err);
      resultado(
        { error: 'Error al crear receta', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { idReceta: res.insertId, ...nuevaReceta });
  });
};

// Obtiene todas las recetas
recetaModel.getAll = (resultado) => {
  db.query('SELECT * FROM receta', (err, res) => {
    if (err) {
      console.error('Error al obtener recetas:', err);
      resultado(
        { error: 'Error al obtener recetas', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene una receta por su ID
recetaModel.findById = (idReceta, resultado) => {
  db.query(
    'SELECT * FROM receta WHERE idReceta = ?',
    [idReceta],
    (err, res) => {
      if (err) {
        console.error('Error al buscar la receta:', err);
        resultado(
          { error: 'Error al buscar receta', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Receta no encontrada' }, null);
      }
    }
  );
};

// Obtiene una receta por el NHC del paciente
recetaModel.findByNhc = (nhc_paciente, resultado) => {
  db.query(
    'SELECT * FROM receta WHERE nhc_paciente = ?',
    [nhc_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al buscar la receta por NHC del paciente:', err);
        resultado(
          {
            error: 'Error al buscar receta por NHC del paciente',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res);
      } else {
        resultado({ tipo: 'Recetas no encontradas para el paciente' }, null);
      }
    }
  );
};

// Obtiene una receta por el ID del medicamento
recetaModel.findByMedicamentoId = (idMedicamento, resultado) => {
  db.query(
    'SELECT * FROM receta WHERE id_medicamento = ?',
    [idMedicamento],
    (err, res) => {
      if (err) {
        console.error('Error al buscar la receta por ID de medicamento:', err);
        resultado(
          {
            error: 'Error al buscar receta por ID de medicamento',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res);
      } else {
        resultado({ tipo: 'Recetas no encontradas para el medicamento' }, null);
      }
    }
  );
};

// Actualiza una receta por su ID
recetaModel.updateById = (id, receta, resultado) => {
  const updateFields = {};
  if ('nhc_paciente' in receta) updateFields.nhc_paciente = receta.nhc_paciente;
  if ('id_medicamento' in receta)
    updateFields.id_medicamento = receta.id_medicamento;
  if ('id_medico' in receta) updateFields.id_medico = receta.id_medico;
  if ('fecha_receta' in receta) updateFields.fecha_receta = receta.fecha_receta;
  if ('Recomendaciones' in receta)
    updateFields.Recomendaciones = receta.Recomendaciones;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE receta SET ? WHERE idReceta = ?',
    [updateFields, id],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar la receta:', err);
        resultado(
          { error: 'Error al actualizar receta', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Receta no encontrada' }, null);
      } else {
        resultado(null, { idReceta: id, ...updateFields });
      }
    }
  );
};

// Elimina una receta por su ID
recetaModel.remove = (id, resultado) => {
  db.query('DELETE FROM receta WHERE idReceta = ?', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar la receta:', err);
      resultado(
        { error: 'Error al eliminar receta', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.affectedRows === 0) {
      resultado({ tipo: 'Receta no encontrada' }, null);
    } else {
      resultado(null, res);
    }
  });
};

// Exportar el modelo
module.exports = recetaModel;
