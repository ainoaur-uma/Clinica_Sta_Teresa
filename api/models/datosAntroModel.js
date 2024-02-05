// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Define el modelo para la entidad de datos antropométricos
const datosAntropometricosModel = function (datos) {
  this.NHC_paciente = datos.NHC_paciente;
  this.fecha_registro = datos.fecha_registro;
  this.peso = datos.peso;
  this.altura = datos.altura;
  this.IMC = datos.IMC;
  this.circunferencia_cintura = datos.circunferencia_cintura;
  this.circunferencia_cadera = datos.circunferencia_cadera;
  this.circunferencia_cabeza = datos.circunferencia_cabeza;
};

// Crea un nuevo registro de datos antropométricos
datosAntropometricosModel.create = (nuevoDato, resultado) => {
  db.query('INSERT INTO datos_antropometricos SET ?', nuevoDato, (err, res) => {
    if (err) {
      console.error('Error al crear el registro:', err);
      resultado(
        { error: 'Error al crear registro', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { idDatoAntropometrico: res.insertId, ...nuevoDato });
  });
};

// Obtiene todos los registros de datos antropométricos
datosAntropometricosModel.getAll = (resultado) => {
  db.query('SELECT * FROM datos_antropometricos', (err, res) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      resultado(
        { error: 'Error al obtener registros', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene un registro de datos antropométricos por su ID
datosAntropometricosModel.findById = (idDatoAntropometrico, resultado) => {
  db.query(
    'SELECT * FROM datos_antropometricos WHERE idDatoAntropometrico = ?',
    [idDatoAntropometrico],
    (err, res) => {
      if (err) {
        console.error('Error al buscar el registro:', err);
        resultado(
          { error: 'Error al buscar registro', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Registro no encontrado' }, null);
      }
    }
  );
};

// Obtiene todos los registros antropométricos de un paciente por su NHC
datosAntropometricosModel.findByPacienteNHC = (NHC_paciente, resultado) => {
  db.query(
    'SELECT * FROM datos_antropometricos WHERE NHC_paciente = ?',
    [NHC_paciente],
    (err, res) => {
      if (err) {
        console.error(
          'Error al buscar registros para el paciente con NHC:',
          NHC_paciente,
          err
        );
        resultado(
          {
            error: 'Error al buscar registros para el paciente',
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
          { tipo: 'No se encontraron registros para el paciente' },
          null
        );
      }
    }
  );
};

// Actualiza un registro de datos antropométricos por su ID
datosAntropometricosModel.updateById = (
  idDatoAntropometrico,
  datos,
  resultado
) => {
  const updateFields = {};

  if ('peso' in datos) updateFields.peso = datos.peso;
  if ('altura' in datos) updateFields.altura = datos.altura;
  if ('IMC' in datos) updateFields.IMC = datos.IMC;
  if ('circunferencia_cintura' in datos)
    updateFields.circunferencia_cintura = datos.circunferencia_cintura;
  if ('circunferencia_cadera' in datos)
    updateFields.circunferencia_cadera = datos.circunferencia_cadera;
  if ('circunferencia_cabeza' in datos)
    updateFields.circunferencia_cabeza = datos.circunferencia_cabeza;
  if ('fecha_registro' in datos)
    updateFields.fecha_registro = datos.fecha_registro;
  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE datos_antropometricos SET ? WHERE idDatoAntropometrico = ?',
    [updateFields, idDatoAntropometrico],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar el registro:', err);
        resultado(
          { error: 'Error al actualizar registro', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Registro no encontrado' }, null);
      } else {
        resultado(null, { idDatoAntropometrico, ...updateFields });
      }
    }
  );
};

// Elimina un registro de datos antropométricos por su ID
datosAntropometricosModel.removeById = (idDatoAntropometrico, resultado) => {
  db.query(
    'DELETE FROM datos_antropometricos WHERE idDatoAntropometrico = ?',
    [idDatoAntropometrico],
    (err, res) => {
      if (err) {
        console.error('Error al eliminar el registro:', err);
        resultado(
          { error: 'Error al eliminar registro', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Registro no encontrado' }, null);
      } else {
        resultado(null, res);
      }
    }
  );
};

// Exportar el modelo
module.exports = datosAntropometricosModel;
