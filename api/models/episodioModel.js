// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Define el modelo para la entidad episodio
const episodioModel = function (episodio) {
  this.NHC_paciente = episodio.NHC_paciente;
  this.Medico = episodio.Medico;
  this.fecha_episodio = episodio.fecha_episodio;
  this.tipo_asistencia = episodio.tipo_asistencia;
  this.motivo_consulta = episodio.motivo_consulta;
  this.anamnesis = episodio.anamnesis;
  this.diagnostico = episodio.diagnostico;
  this.tratamiento = episodio.tratamiento;
  this.peso = episodio.peso;
  this.pa = episodio.pa;
  this.spo2 = episodio.spo2;
};

// Crea un nuevo episodio
episodioModel.create = (nuevoEpisodio, resultado) => {
  db.query('INSERT INTO episodio SET ?', nuevoEpisodio, (err, res) => {
    if (err) {
      console.error('Error al crear el episodio:', err);
      resultado(
        { error: 'Error al crear episodio', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { idEpisodio: res.insertId, ...nuevoEpisodio });
  });
};

// Obtiene todos los episodios
episodioModel.getAll = (resultado) => {
  db.query('SELECT * FROM episodio', (err, res) => {
    if (err) {
      console.error('Error al obtener los episodios:', err);
      resultado(
        { error: 'Error al obtener episodios', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene un episodio por su id
episodioModel.findById = (idEpisodio, resultado) => {
  db.query(
    'SELECT * FROM episodio WHERE idEpisodio = ?',
    [idEpisodio],
    (err, res) => {
      if (err) {
        console.error('Error al buscar el episodio:', err);
        resultado(
          { error: 'Error al buscar episodio', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Episodio no encontrado' }, null);
      }
    }
  );
};

// Obtiene todos los episodios de un paciente por su NHC
episodioModel.findByPacienteNHC = (NHC_paciente, resultado) => {
  db.query(
    'SELECT * FROM episodio WHERE NHC_paciente = ?',
    [NHC_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al buscar episodios por NHC de paciente:', err);
        resultado(
          {
            error: 'Error al buscar episodios por NHC de paciente',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res);
      } else {
        resultado(
          { tipo: 'No se encontraron episodios para el NHC proporcionado' },
          null
        );
      }
    }
  );
};

// Actualiza un episodio por su id
episodioModel.updateById = (idEpisodio, episodio, resultado) => {
  const updateFields = {};
  if ('NHC_paciente' in episodio)
    updateFields.NHC_paciente = episodio.NHC_paciente;
  if ('Medico' in episodio) updateFields.Medico = episodio.Medico;
  if ('fecha_episodio' in episodio)
    updateFields.fecha_episodio = episodio.fecha_episodio;
  if ('tipo_asistencia' in episodio)
    updateFields.tipo_asistencia = episodio.tipo_asistencia;
  if ('motivo_consulta' in episodio)
    updateFields.motivo_consulta = episodio.motivo_consulta;
  if ('anamnesis' in episodio) updateFields.anamnesis = episodio.anamnesis;
  if ('diagnostico' in episodio)
    updateFields.diagnostico = episodio.diagnostico;
  if ('tratamiento' in episodio)
    updateFields.tratamiento = episodio.tratamiento;
  if ('peso' in episodio) updateFields.peso = episodio.peso;
  if ('pa' in episodio) updateFields.pa = episodio.pa;
  if ('spo2' in episodio) updateFields.spo2 = episodio.spo2;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE episodio SET ? WHERE idEpisodio = ?',
    [updateFields, idEpisodio],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar el episodio:', err);
        resultado(
          { error: 'Error al actualizar episodio', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Episodio no encontrado' }, null);
      } else {
        resultado(null, { idEpisodio, ...updateFields });
      }
    }
  );
};

// Elimina un episodio por su id
episodioModel.removeById = (idEpisodio, resultado) => {
  db.query(
    'DELETE FROM episodio WHERE idEpisodio = ?',
    [idEpisodio],
    (err, res) => {
      if (err) {
        console.error('Error al eliminar el episodio:', err);
        resultado(
          { error: 'Error al eliminar episodio', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Episodio no encontrado' }, null);
      } else {
        resultado(null, res);
      }
    }
  );
};

// Exportar el modelo
module.exports = episodioModel;
