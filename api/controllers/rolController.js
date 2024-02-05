// Importar el modelo
const rolModel = require('../models/rolModel');

// Validar los datos del rol
const validarRol = (rol) => {
  const errores = [];
  if (!rol.descripcion_rol) {
    errores.push('La descripción del rol es requerida.');
  }
  return errores;
};

// Crea un nuevo rol
exports.create = (req, res) => {
  const nuevoRol = {
    descripcion_rol: req.body.descripcion_rol,
  };

  const errores = validarRol(nuevoRol);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  rolModel.create(nuevoRol, (err, rol) => {
    if (err) {
      console.error('Error al crear el rol:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al crear el rol', error: err });
    }
    return res.status(201).json(rol);
  });
};

// Obtiene todos los roles de la base de datos
exports.findAll = (req, res) => {
  rolModel.getAll((err, roles) => {
    if (err) {
      console.error('Error al obtener todos los roles:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al obtener todos los roles', error: err });
    }
    return res.status(200).json(roles);
  });
};

// Obtiene un rol por su ID
exports.findOne = (req, res) => {
  const rolId = req.params.rolId;
  if (!rolId) {
    return res.status(400).json({ mensaje: 'ID de rol no proporcionado' });
  }

  rolModel.findById(rolId, (err, rol) => {
    if (err) {
      console.error('Error al obtener el rol por su ID:', err);
      return res.status(500).json({
        mensaje: `Error al obtener el rol con ID ${rolId}`,
        error: err,
      });
    }
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }
    return res.status(200).json(rol);
  });
};

// Actualiza un rol por su ID
exports.update = (req, res) => {
  const rolId = req.params.rolId;
  const updatedData = req.body;

  const errores = validarRol(updatedData);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  rolModel.updateById(rolId, updatedData, (err, result) => {
    if (err) {
      console.error('Error al actualizar el rol por su ID:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al actualizar el rol por su ID ', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    return res
      .status(200)
      .json({ mensaje: `Rol con ID ${rolId} actualizado exitosamente` });
  });
};

// Elimina un rol por su ID
exports.delete = (req, res) => {
  const rolId = req.params.rolId;

  rolModel.remove(rolId, (err, result) => {
    if (err) {
      console.error('Error al eliminar el rol:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar el rol con ID ${rolId}`,
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    return res
      .status(200)
      .json({ mensaje: `Rol con ID ${rolId} eliminado exitosamente` });
  });
};

// Exportamos las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  delete: exports.delete,
};
