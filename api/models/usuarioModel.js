// Importar el pool de conexión a la base de datos y Joi para validación
const db = require('../../server/db_connection');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Esquema de validación Joi para un usuario durante la creación
const usuarioSchema = Joi.object({
  idUsuario: Joi.number().integer(),
  nombre_usuario: Joi.string().max(50).required(),
  contrasena: Joi.string().max(255).required(),
  rol_usuario: Joi.number().integer().required(),
});

// Esquema de validación Joi para actualización parcial con PATCH
const usuarioSchemaUpdate = Joi.object({
  nombre_usuario: Joi.string().max(50),
  contrasena: Joi.string().max(255),
  rol_usuario: Joi.number().integer(),
}).min(1); // Requiere al menos un campo para la actualización

const usuarioModel = {
  /**
   * Crea un nuevo usuario en la base de datos después de validar los datos de entrada.
   * La contraseña proporcionada se hashea antes de la inserción para garantizar la seguridad.
   * Si los datos no cumplen con el esquema, se lanza un error de validación.
   * Si la inserción es exitosa, devuelve el nuevo usuario con su ID asignado.
   */
  async create(nuevoUsuario) {
    const { error, value } = usuarioSchema.validate(nuevoUsuario);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    // Hashear la contraseña antes de insertar el nuevo usuario en la base de datos
    if (value.contrasena) {
      value.contrasena = await bcrypt.hash(value.contrasena, saltRounds);
    }

    try {
      const [res] = await db.query('INSERT INTO usuario SET ?', value);
      return { idUsuario: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear el usuario: ${err.message}`);
    }
  },

  /**
   * Obtiene todos los usuarios de la base de datos.
   * En caso de error de conexión, se lanza un error específico.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM usuario');
      return res;
    } catch (err) {
      throw new Error('Error al obtener usuarios: ' + err.message);
    }
  },

  /**
   * Busca un usuario por su ID (idUsuario). Valida que el ID sea numérico y exista en la base de datos.
   * En caso de no encontrar el usuario, se lanza un error específico.
   */
  async findById(usuarioId) {
    const { error } = Joi.number().integer().required().validate(usuarioId);
    if (error) throw new Error('El ID proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM usuario WHERE idUsuario = ?',
        [usuarioId]
      );
      if (res.length === 0) throw new Error('Usuario no encontrado');
      return res[0];
    } catch (err) {
      throw new Error('Error al buscar el usuario: ' + err.message);
    }
  },

  /**
   * Busca un usuario por su nombre de usuario (nombre_usuario). Valida que el nombre de usuario sea una cadena válida.
   * En caso de no encontrar el usuario, se lanza un error específico.
   */
  async findByUsername(nombre_usuario) {
    const { error } = Joi.string().required().validate(nombre_usuario);
    if (error)
      throw new Error('El nombre de usuario proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM usuario WHERE nombre_usuario = ?',
        [nombre_usuario]
      );
      if (res.length === 0) throw new Error('Usuario no encontrado');
      return res[0];
    } catch (err) {
      throw new Error('Error al buscar el usuario: ' + err.message);
    }
  },

  /**
   * Actualiza un usuario por su ID(idUsuario) utilizando los datos proporcionados. Antes de la actualización,
   * valida los datos utilizando `usuarioSchemaUpdate`. Si se proporciona una contraseña, la hashea
   * antes de guardarla en la base de datos. Esto asegura que todas las contraseñas se almacenen de forma segura.
   */
  async updateById(id, usuario) {
    // Validación de los datos de entrada con usuarioSchemaUpdate
    const { error, value } = usuarioSchemaUpdate.validate(usuario);
    if (error)
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );

    // Si se proporciona una contraseña, hashearla antes de la actualización
    if (value.contrasena) {
      value.contrasena = await bcrypt.hash(value.contrasena, saltRounds);
    }

    try {
      const [res] = await db.query('UPDATE usuario SET ? WHERE idUsuario = ?', [
        value,
        id,
      ]);
      if (res.affectedRows === 0)
        throw new Error('Usuario no encontrado o sin cambios necesarios.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar el usuario: ${err.message}`);
    }
  },

  /**
   * Elimina un usuario por su ID (idUsuario) después de validar que el ID sea numérico.
   * Verifica que el usuario a eliminar exista. En caso de no encontrar el usuario, se lanza un error específico.
   */
  async remove(id) {
    const { error } = Joi.number().integer().required().validate(id);
    if (error) throw new Error('El ID proporcionado es inválido.');

    try {
      const [res] = await db.query('DELETE FROM usuario WHERE idUsuario = ?', [
        id,
      ]);
      if (res.affectedRows === 0) throw new Error('Usuario no encontrado.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error('Error al eliminar el usuario: ' + err.message);
    }
  },

  /**
   * Obtiene todos los usuarios ordenados alfabéticamente por su nombre de usuario.
   * En caso de error de conexión, se lanza un error específico.
   */
  async getAllSortedByName() {
    try {
      const [res] = await db.query(
        'SELECT * FROM usuario ORDER BY nombre_usuario ASC'
      );
      return res;
    } catch (err) {
      throw new Error('Error al obtener usuarios ordenados: ' + err.message);
    }
  },
};

module.exports = usuarioModel;
