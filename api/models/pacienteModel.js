// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Definir el modelo para la entidad paciente
const pacienteModel = function (paciente) {
  this.NHC = paciente.NHC;
  this.tutor_info = paciente.tutor_info;
  this.grado = paciente.grado;
  this.otra_info = paciente.otra_info;
};

// Crear un nuevo paciente
pacienteModel.create = (nuevoPaciente, resultado) => {
  db.query('INSERT INTO paciente SET ?', nuevoPaciente, (err, res) => {
    if (err) {
      console.error('Error al crear el paciente:', err);
      resultado(
        { error: 'Error al crear paciente', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { NHC: res.insertId, ...nuevoPaciente });
  });
};

// Obtener todos los pacientes
pacienteModel.getAll = (resultado) => {
  db.query('SELECT * FROM paciente', (err, res) => {
    if (err) {
      console.error('Error al obtener pacientes:', err);
      resultado(
        { error: 'Error al obtener pacientes', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtener un paciente por su NHC
pacienteModel.findById = (NHC, resultado) => {
  db.query('SELECT * FROM paciente WHERE NHC = ?', [NHC], (err, res) => {
    if (err) {
      console.error('Error al buscar el paciente:', err);
      resultado(
        { error: 'Error al buscar paciente', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.length) {
      resultado(null, res[0]);
    } else {
      resultado({ tipo: 'Paciente no encontrado' }, null);
    }
  });
};

// Actualizar un paciente por su NHC
pacienteModel.updateById = (NHC, paciente, resultado) => {
  const updateFields = {};
  if ('tutor_info' in paciente) updateFields.tutor_info = paciente.tutor_info;
  if ('grado' in paciente) updateFields.grado = paciente.grado;
  if ('otra_info' in paciente) updateFields.otra_info = paciente.otra_info;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE paciente SET ? WHERE NHC = ?',
    [updateFields, NHC],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar paciente:', err);
        resultado(
          { error: 'Error al actualizar paciente', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Paciente no encontrado' }, null);
      } else {
        resultado(null, { NHC: NHC, ...updateFields });
      }
    }
  );
};

// Eliminar un paciente por su NHC
pacienteModel.remove = (NHC, resultado) => {
  db.query('DELETE FROM paciente WHERE NHC = ?', [NHC], (err, res) => {
    if (err) {
      console.error('Error al eliminar paciente:', err);
      resultado(
        { error: 'Error al eliminar paciente', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.affectedRows === 0) {
      resultado({ tipo: 'Paciente no encontrado' }, null);
    } else {
      resultado(null, res);
    }
  });
};

// Exportar el modelo
module.exports = pacienteModel;
