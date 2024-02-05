// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Definir el modelo para la entidad de medicamento
const medicamentoModel = function (medicamento) {
  this.idMedicamento = medicamento.idMedicamento;
  this.nombre_medicamento = medicamento.nombre_medicamento;
  this.principio_activo = medicamento.principio_activo;
  this.descripcion_medicamento = medicamento.descripcion_medicamento;
  this.fecha_caducidad = medicamento.fecha_caducidad;
  this.forma_dispensacion = medicamento.forma_dispensacion;
};

// Crea un nuevo medicamento
medicamentoModel.create = (nuevoMedicamento, resultado) => {
  db.query('INSERT INTO medicamento SET ?', nuevoMedicamento, (err, res) => {
    if (err) {
      console.error('Error al crear el medicamento:', err);
      resultado(
        {
          error: 'Error al crear el medicamento',
          detalles: err.sqlMessage,
        },
        null
      );
      return;
    }
    resultado(null, { idMedicamento: res.insertId, ...nuevoMedicamento });
  });
};

// Obtiene todos los medicamentos
medicamentoModel.getAll = (resultado) => {
  db.query('SELECT * FROM medicamento', (err, res) => {
    if (err) {
      console.error('Error al obtener los medicamentos:', err);
      resultado(
        { error: 'Error al obtener medicamentos', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene un medicamento por su ID
medicamentoModel.findById = (medicamentoId, resultado) => {
  db.query(
    'SELECT * FROM medicamento WHERE idMedicamento = ?',
    [medicamentoId],
    (err, res) => {
      if (err) {
        console.error('Error al buscar el medicamento:', err);
        resultado(
          { error: 'Error al buscar medicamento', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Medicamento no encontrado' }, null);
      }
    }
  );
};

// Actualiza un medicamento por su ID con PATCH
medicamentoModel.updateById = (id, medicamento, resultado) => {
  const updateFields = {};

  if ('nombre_medicamento' in medicamento)
    updateFields.nombre_medicamento = medicamento.nombre_medicamento;
  if ('principio_activo' in medicamento)
    updateFields.principio_activo = medicamento.principio_activo;
  if ('descripcion_medicamento' in medicamento)
    updateFields.descripcion_medicamento = medicamento.descripcion_medicamento;
  if ('fecha_caducidad' in medicamento)
    updateFields.fecha_caducidad = medicamento.fecha_caducidad;
  if ('forma_dispensacion' in medicamento)
    updateFields.forma_dispensacion = medicamento.forma_dispensacion;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE medicamento SET ? WHERE idMedicamento = ?',
    [updateFields, id],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar medicamento:', err);
        resultado(
          {
            error: 'Error al actualizar medicamento',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Medicamento no encontrado' }, null);
      } else {
        resultado(null, { idMedicamento: id, ...updateFields });
      }
    }
  );
};

// Elimina un medicamento por su ID
medicamentoModel.remove = (id, resultado) => {
  db.query(
    'DELETE FROM medicamento WHERE idMedicamento = ?',
    id,
    (err, res) => {
      if (err) {
        console.error('Error al eliminar medicamento:', err);
        resultado(
          { error: 'Error al eliminar medicamento', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Medicamento no encontrado' }, null);
      } else {
        resultado(null, res);
      }
    }
  );
};

// Exportar el modelo
module.exports = medicamentoModel;
