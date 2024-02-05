const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

const usuarioController = {
  /**
   * Este método maneja la creación de un nuevo usuario. Recibe los datos del usuario desde el cuerpo de la solicitud HTTP,
   * hashea la contraseña para seguridad y luego llama al modelo de usuario para insertar el nuevo usuario en la base de datos.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y el usuario creado.
   * En caso de error, envía una respuesta con estado 500 y detalles del error.
   */
  async create(req, res) {
    try {
      const { nombre_usuario, contrasena, rol_usuario } = req.body;
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
      const nuevoUsuario = {
        nombre_usuario,
        contrasena: hashedPassword,
        rol_usuario,
      };
      const usuarioCreado = await usuarioModel.create(nuevoUsuario);
      res.status(201).json(usuarioCreado);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear usuario', error: err.message });
    }
  },

  /**
   * Este método recupera todos los usuarios de la base de datos. Llama al método 'getAll' del modelo de usuario,
   * que ejecuta una consulta SQL para obtener todos los registros de usuarios. Si la consulta tiene éxito,
   * devuelve una respuesta con estado 200 y la lista de usuarios. En caso de error, captura la excepción,
   * envía una respuesta con estado 500 y detalles del error.
   */
  async findAll(req, res) {
    try {
      const usuarios = await usuarioModel.getAll();
      res.status(200).json(usuarios);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener usuarios', error: err.message });
    }
  },

  /**
   * Este método obtiene un usuario específico por su ID (idUsuario). Se extrae el idUsuario del usuario de los parámetros de la solicitud HTTP,
   * y se utiliza para llamar al método 'findById' del modelo de usuario. Si se encuentra el usuario, se devuelve con estado 200.
   * Si el usuario no existe, se devuelve un estado 404 indicando que no se encontró. En caso de un error en la consulta,
   * se devuelve una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    try {
      const usuarioId = req.params.usuarioId;
      const usuario = await usuarioModel.findById(usuarioId);
      if (!usuario) {
        return res
          .status(404)
          .json({ mensaje: `Usuario con id ${usuarioId}no encontrado` });
      }
      res.status(200).json(usuario);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener usuario con ID ${usuarioId}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca y devuelve un usuario basado en su nombre de usuario. El nombre de usuario se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByUsername' del modelo de usuario para realizar la búsqueda.
   * Si el usuario es encontrado, se devuelve un objeto usuario con una respuesta de estado 200.
   * Si el usuario no es encontrado, se devuelve una respuesta de estado 404 con el mensaje 'Usuario no encontrado'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByUsername(req, res) {
    try {
      const nombre_usuario = req.params.nombre_usuario;
      const usuario = await usuarioModel.findByUsername(nombre_usuario);
      if (!usuario) {
        return res.status(404).json({
          mensaje: `Usuario  con nombre ${nombre_usuario} no encontrado`,
        });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener usuario con nombre ${nombre_usuario}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza la información de un usuario específico por su ID (idUsuario). Los datos a actualizar se reciben
   * en el cuerpo de la solicitud HTTP. Se hace una llamada al método 'updateById' del modelo de usuario para aplicar
   * las actualizaciones en la base de datos. Si la actualización es exitosa, se devuelve una respuesta con estado 200
   * y un mensaje indicando el éxito de la operación.
   * Si no se encuentra el usuario a actualizar, se debería devolver un estado 404 con un mensaje 'Usuario no encontrado'.
   * En caso de un error durante la actualización, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async updateById(req, res) {
    try {
      const usuarioId = req.params.usuarioId;
      const updatedData = req.body;
      const result = await usuarioModel.updateById(usuarioId, updatedData);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Usuario con ID ${usuarioId} no encontrado` });
      }

      res.status(200).json({
        mensaje: `Usuario con ID ${usuarioId} actualizado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar usuario con ID ${usuarioId}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método elimina un usuario específico por su ID (idUsuario). El ID del usuario se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'remove' del modelo de usuario para eliminar
   * el usuario de la base de datos. Si la eliminación es exitosa, se devuelve una respuesta con estado 200
   * y un mensaje indicando el éxito de la operación.
   * Si no se encuentra el usuario a eliminar o si ocurre un error durante la eliminación, se devuelve una respuesta
   * de estado 500 con los detalles del error.
   */
  async deleteById(req, res) {
    try {
      const usuarioId = req.params.usuarioId;
      await usuarioModel.remove(usuarioId);
      res.status(200).json({
        mensaje: `Usuario con ID ${usuarioId} eliminado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar usuario con ID ${usuarioId}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera todos los usuarios de la base de datos y los devuelve ordenados alfabéticamente
   * por su nombre de usuario. Se hace una llamada al método 'getAllSortedByName' del modelo de usuario para realizar
   * la consulta. Si la consulta es exitosa, se devuelve una lista de usuarios con una respuesta de estado 200.
   * En caso de un error durante la consulta, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async getAllSortedByName(req, res) {
    try {
      const usuarios = await usuarioModel.getAllSortedByName();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener usuarios ordenados por nombre`,
        error: error.message,
      });
    }
  },
};

module.exports = usuarioController;
