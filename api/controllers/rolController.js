const RolModel = require('../models/rolModel');

const rolController = {
  /**
   * Crea un nuevo rol en la base de datos. Valida los datos de entrada y, si son válidos,
   * inserta el nuevo rol. Devuelve una respuesta con los detalles del rol creado.
   */
  async create(req, res) {
    try {
      const descripcionRol = req.body.descripcion_rol;
      const rolCreado = await RolModel.create(descripcionRol);
      res.status(201).json(rolCreado);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al crear el rol',
        error: error.message,
      });
    }
  },

  /**
   * Recupera todos los roles de la base de datos. No requiere parámetros.
   * Devuelve una lista de entradas de la agenda con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const roles = await RolModel.getAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al obtener los roles',
        error: error.message,
      });
    }
  },

  /**
   * Este método obtiene un rol específico por su ID (idRol). El idRol se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del rol con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar el rol, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idRol = req.params.idRol;
    try {
      const rol = await RolModel.findById(idRol);
      if (!rol) {
        return res
          .status(404)
          .json({ mensaje: `Rol con ID ${idRol} no encontrado` });
      }
      res.status(200).json(rol);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener el rol con ID ${idRol}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca roles por su descripción. La descripción se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve una lista de roles que coinciden con la descripción proporcionada con una respuesta de estado 200.
   * En caso de no encontrar roles con esa descripción, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByDescripcion(req, res) {
    try {
      const descripcion = req.params.descripcion;
      const roles = await RolModel.findByDescripcion(descripcion);
      if (roles.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron roles con la descripción ${descripcion}`,
        });
      }
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al buscar roles por descripción`,
        error: error.message,
      });
    }
  },
  /**
   * Este método actualiza un rol específico por su ID(idRol) con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el rol, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idRol = req.params.idRol;
    try {
      const descripcionRol = req.body.descripcion_rol;
      const resultado = await RolModel.updateById(idRol, descripcionRol);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Rol con ID ${idRol} no encontrado o sin cambios necesarios`,
        });
      }
      res
        .status(200)
        .json({ mensaje: `Rol con ID ${idRol} actualizado exitosamente` });
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al actualizar el rol con ID ${idRol}`,
        error: error.message,
      });
    }
  },

  /**
   * Elimina un rol específico por su ID. El ID se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el rol a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idRol = req.params.idRol;
    try {
      const resultado = await RolModel.removeById(idRol);
      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Rol con ID ${idRol} no encontrado` });
      }
      res
        .status(200)
        .json({ mensaje: `Rol con ID ${idRol} eliminado exitosamente` });
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al eliminar el rol con ID ${idRol}`,
        error: error.message,
      });
    }
  },
};

module.exports = rolController;
