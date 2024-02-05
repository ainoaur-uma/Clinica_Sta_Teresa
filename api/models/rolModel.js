// Importar el pool de conexión a la base de datos
const db = require('../../server/db_connection');

// Definir el modelo para la entidad rol
const rolModel = function (rol) {
  this.idRol = rol.idRol;
  this.descripcion_rol = rol.descripcion_rol;
};

// Crear un nuevo rol
rolModel.create = (nuevoRol, resultado) => {
  db.query('INSERT INTO rol SET ?', nuevoRol, (err, res) => {
    if (err) {
      console.error('Error al crear el rol:', err);
      resultado(
        { error: 'Error al crear rol', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, { idRol: res.insertId, ...nuevoRol });
  });
};

// Obtiene todos los roles
rolModel.getAll = (resultado) => {
  db.query('SELECT * FROM rol', (err, res) => {
    if (err) {
      console.error('Error al obtener los roles:', err);
      resultado(
        { error: 'Error al obtener roles', detalles: err.sqlMessage },
        null
      );
      return;
    }
    resultado(null, res);
  });
};

// Obtiene un rol por su ID
rolModel.findById = (rolId, resultado) => {
  db.query('SELECT * FROM rol WHERE idRol = ?', [rolId], (err, res) => {
    if (err) {
      console.error('Error al buscar el rol:', err);
      resultado(
        { error: 'Error al buscar rol', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.length) {
      resultado(null, res[0]);
    } else {
      resultado({ tipo: 'Rol no encontrado' }, null);
    }
  });
};

// Actualiza un rol por su ID
rolModel.updateById = (id, rol, resultado) => {
  const updateFields = {};
  if ('descripcion_rol' in rol)
    updateFields.descripcion_rol = rol.descripcion_rol;

  if (Object.keys(updateFields).length === 0) {
    resultado({ tipo: 'Nada que actualizar' }, null);
    return;
  }

  db.query(
    'UPDATE rol SET ? WHERE idRol = ?',
    [updateFields, id],
    (err, res) => {
      if (err) {
        console.error('Error al actualizar el rol:', err);
        resultado(
          { error: 'Error al actualizar rol', detalles: err.sqlMessage },
          null
        );
        return;
      }
      if (res.affectedRows === 0) {
        resultado({ tipo: 'Rol no encontrado' }, null);
      } else {
        resultado(null, { idRol: id, ...updateFields });
      }
    }
  );
};

// Elimina un rol por su ID
rolModel.remove = (id, resultado) => {
  db.query('DELETE FROM rol WHERE idRol = ?', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar el rol:', err);
      resultado(
        { error: 'Error al eliminar rol', detalles: err.sqlMessage },
        null
      );
      return;
    }
    if (res.affectedRows === 0) {
      resultado({ tipo: 'Rol no encontrado' }, null);
    } else {
      resultado(null, res);
    }
  });
};

// Exportar el modelo
module.exports = rolModel;
