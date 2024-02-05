// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Define el modelo para la entidad de historia clínica electrónica (HCE)
const hceModel = function (hce) {
  this.NHC_paciente = hce.NHC_paciente;
  this.sexo = hce.sexo;
  this.grupo_sanguineo = hce.grupo_sanguineo;
  this.alergias = hce.alergias;
  this.antecedentes_clinicos = hce.antecedentes_clinicos;
};

// Crea una nueva HCE
hceModel.create = (nuevaHce, resultado) => {
  db.query('INSERT INTO hce SET ?', nuevaHce, (err, res) => {
    if (err) {
      console.error('Error al crear la HCE:', err);
      resultado(
        { error: 'Error al crear HCE', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { NHC_paciente: res.insertId, ...nuevaHce });
  });
};

// Obtiene todas las HCEs
hceModel.getAll = (resultado) => {
  db.query('SELECT * FROM hce', (err, res) => {
    if (err) {
      console.error('Error al obtener las HCEs:', err);
      resultado(
        { error: 'Error al obtener HCEs', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene una HCE por el NHC del paciente
hceModel.findByNHC = (NHC_paciente, resultado) => {
  db.query(
    'SELECT * FROM hce WHERE NHC_paciente = ?',
    [NHC_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al buscar la HCE:', err);
        resultado(
          { error: 'Error al buscar HCE', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'HCE no encontrada' }, null);
      }
    }
  );
};

// Actualiza una HCE por el NHC del paciente
hceModel.updateByNHC = (NHC_paciente, hce, resultado) => {
  const updateFields = {};
  if ('sexo' in hce) updateFields.sexo = hce.sexo;
  if ('grupo_sanguineo' in hce)
    updateFields.grupo_sanguineo = hce.grupo_sanguineo;
  if ('alergias' in hce) updateFields.alergias = hce.alergias;
  if ('antecedentes_clinicos' in hce)
    updateFields.antecedentes_clinicos = hce.antecedentes_clinicos;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE hce SET ? WHERE NHC_paciente = ?',
    [updateFields, NHC_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar la HCE:', err);
        resultado(
          { error: 'Error al actualizar HCE', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'HCE no encontrada' }, null);
      } else {
        resultado(null, { NHC_paciente, ...updateFields });
      }
    }
  );
};

// Elimina una HCE por el NHC del paciente
hceModel.removeByNHC = (NHC_paciente, resultado) => {
  db.query(
    'DELETE FROM hce WHERE NHC_paciente = ?',
    [NHC_paciente],
    (err, res) => {
      if (err) {
        console.error('Error al eliminar la HCE:', err);
        resultado(
          { error: 'Error al eliminar HCE', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'HCE no encontrada' }, null);
      } else {
        resultado(null, res);
      }
    }
  );
};

// Exportar el modelo
module.exports = hceModel;
