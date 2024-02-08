const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de un rol
const rolSchema = Joi.object({
  descripcion_rol: Joi.string().max(50).required(),
});

const RolModel = {
  /**
   * Este método crea un nuevo rol en la base de datos.
   * Valida los datos de entrada con rolSchema antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * Si los datos son válidos, inserta el nuevo rol en la base de datos y devuelve el rol creado con su ID.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(descripcionRol) {
    const { error, value } = rolSchema.validate({
      descripcion_rol: descripcionRol,
    });
    if (error)
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );

    try {
      const [res] = await db.query(
        'INSERT INTO rol (descripcion_rol) VALUES (?)',
        [value.descripcion_rol]
      );
      return { idRol: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear el rol: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todos los roles de la base de datos.
   * Realiza una consulta para recuperar todos los registros de la tabla rol.
   * No requiere validación de entrada y devuelve una lista de todos los roles.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [roles] = await db.query('SELECT * FROM rol');
      return roles;
    } catch (err) {
      throw new Error(`Error al obtener los roles: ${err.message}`);
    }
  },

  /**
   * Este método busca un rol por su ID.
   * Utiliza validación para asegurar que el idRol es un número entero válido antes de realizar la consulta.
   * Si el rol es encontrado, devuelve los detalles del rol. Si no se encuentra, lanza un error especificando que el rol no fue encontrado.
   * En caso de error en la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async findById(idRol) {
    try {
      const [rol] = await db.query('SELECT * FROM rol WHERE idRol = ?', [
        idRol,
      ]);
      if (rol.length === 0) throw new Error('Rol no encontrado');
      return rol[0];
    } catch (err) {
      throw new Error(`Error al buscar el rol: ${err.message}`);
    }
  },

  /**
   * Este método busca un rol por su descripción.
   * Valida que la descripción proporcionada sea una cadena de caracteres válida antes de realizar la consulta.
   * Si encuentra uno o más roles que coinciden con la descripción proporcionada, devuelve los detalles de estos roles.
   * Si no se encuentra ningún rol con esa descripción, lanza un error especificando que no se encontraron roles con esa descripción.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async findByDescripcion(descripcion) {
    const { error } = Joi.string().max(100).required().validate(descripcion);
    if (error) throw new Error('La descripción proporcionada es inválida.');

    try {
      const [res] = await db.query(
        'SELECT * FROM rol WHERE descripcion_rol = ?',
        [descripcion]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron roles con la descripción proporcionada.'
        );
      return res;
    } catch (err) {
      throw new Error('Error al buscar roles por descripción: ' + err.message);
    }
  },

  /**
   * Este método actualiza un rol existente por su ID(idRol) con los datos proporcionados.
   * Valida los datos de entrada con rolSchema para asegurar que el campo de descripción es válido.
   * Si la actualización es exitosa, devuelve el número de filas afectadas.
   * Si el rol no se encuentra o no hay cambios necesarios, lanza un error específico.
   * En caso de error durante la actualización, lanza una excepción con el mensaje de error correspondiente.
   */
  async updateById(idRol, descripcionRol) {
    const { error, value } = rolSchema.validate({
      descripcion_rol: descripcionRol,
    });
    if (error)
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );

    try {
      const [res] = await db.query(
        'UPDATE rol SET descripcion_rol = ? WHERE idRol = ?',
        [value.descripcion_rol, idRol]
      );
      if (res.affectedRows === 0)
        throw new Error('Rol no encontrado o sin cambios necesarios');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar el rol: ${err.message}`);
    }
  },

  /**
   * Este método elimina un rol por su ID (idRol).
   * Valida que el idRol sea un número entero válido antes de realizar la eliminación.
   * Si el rol se elimina con éxito, devuelve el número de filas afectadas.
   * Si el rol no se encuentra, lanza un error específico indicando que el rol no fue encontrado.
   * En caso de error durante la eliminación, lanza una excepción con el mensaje de error correspondiente.
   */
  async removeById(idRol) {
    const { error } = Joi.number().integer().required().validate(idRol);
    if (error) throw new Error('El ID del rol proporcionado es inválido.');

    try {
      const [res] = await db.query('DELETE FROM rol WHERE idRol = ?', [idRol]);
      if (res.affectedRows === 0) throw new Error('Rol no encontrado.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar el rol: ${err.message}`);
    }
  },
};

module.exports = RolModel;
