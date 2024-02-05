// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Definir el modelo para la entidad de inventario de medicamentos
const inventarioMedicamentosModel = function (inventario) {
  this.idInventario = inventario.idInventario;
  this.idMedicamento = inventario.idMedicamento;
  this.cantidad_actual = inventario.cantidad_actual;
  this.fecha_registro = inventario.fecha_registro;
};

// Crea un nuevo registro en el inventario de medicamentos
inventarioMedicamentosModel.create = (nuevoInventario, resultado) => {
  db.query(
    'INSERT INTO inventario_medicamentos SET ?',
    nuevoInventario,
    (err, res) => {
      if (err) {
        console.error('Error al insertar en inventario de medicamentos:', err);
        resultado(
          {
            error: 'Error al crear registro en inventario de medicamentos',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      resultado(null, { idInventario: res.insertId, ...nuevoInventario });
    }
  );
};

// Obtiene todos los registros del inventario de medicamentos
inventarioMedicamentosModel.getAll = (resultado) => {
  db.query('SELECT * FROM inventario_medicamentos', (err, res) => {
    if (err) {
      console.error('Error al obtener inventario de medicamentos:', err);
      resultado(
        { error: 'Error al obtener inventario', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

//**Funciones que dependerán de idMedicamento **//

// Obtiene un registro del inventario de medicamentos por ID de medicamento
inventarioMedicamentosModel.findByIdMedicamento = (
  idMedicamento,
  resultado
) => {
  db.query(
    'SELECT * FROM inventario_medicamentos WHERE idMedicamento = ?',
    [idMedicamento],
    (err, res) => {
      if (err) {
        console.error(
          'Error al buscar en inventario por ID de medicamento:',
          err
        );
        resultado(
          { error: 'Error al buscar en inventario', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res);
      } else {
        resultado({ tipo: 'Registro de inventario no encontrado' }, null);
      }
    }
  );
};

//**Funciones basadas en idInventario **//
// Obtiene un registro del inventario por ID del inventario
inventarioMedicamentosModel.findByIdInventario = (idInventario, resultado) => {
  db.query(
    'SELECT * FROM inventario_medicamentos WHERE idInventario = ?',
    [idInventario],
    (err, res) => {
      if (err) {
        console.error(
          'Error al buscar en inventario por ID del inventario:',
          err
        );
        resultado(
          { error: 'Error al buscar en inventario', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.length) {
        resultado(null, res[0]);
      } else {
        resultado({ tipo: 'Registro de inventario no encontrado' }, null);
      }
    }
  );
};

// Actualiza un registro del inventario por ID del inventario
inventarioMedicamentosModel.updateByIdInventario = (
  idInventario,
  inventario,
  resultado
) => {
  const updateFields = {};
  if ('cantidad_actual' in inventario)
    updateFields.cantidad_actual = inventario.cantidad_actual;
  if ('fecha_registro' in inventario)
    updateFields.fecha_registro = inventario.fecha_registro;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE inventario_medicamentos SET ? WHERE idInventario = ?',
    [updateFields, idInventario],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar inventario de medicamentos:', err);
        resultado(
          { error: 'Error al actualizar inventario', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Registro de inventario no encontrado' }, null);
      } else {
        resultado(null, { idInventario, ...updateFields });
      }
    }
  );
};

// Elimina un registro del inventario por ID del inventario
inventarioMedicamentosModel.removeByIdInventario = (
  idInventario,
  resultado
) => {
  db.query(
    'DELETE FROM inventario_medicamentos WHERE idInventario = ?',
    [idInventario],
    (err, res) => {
      if (err) {
        console.error('Error al eliminar registro del inventario:', err);
        resultado(
          {
            error: 'Error al eliminar registro del inventario',
            detalles: err.sqlMessage,
          },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Registro de inventario no encontrado' }, null);
      } else {
        resultado(null, res);
      }
    }
  );
};

// Exportar el modelo
module.exports = inventarioMedicamentosModel;
