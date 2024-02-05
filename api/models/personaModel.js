const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de una persona
const personaSchema = Joi.object({
  idPersona: Joi.number().integer(),
  carnet_identidad: Joi.string().max(20),
  nombre: Joi.string().max(100).required(),
  apellido1: Joi.string().max(100).required(),
  apellido2: Joi.string().max(100),
  fecha_nacimiento: Joi.date(),
  escuela: Joi.string().max(100),
  telefono: Joi.string().max(20),
  email: Joi.string().email(),
  departamento: Joi.string().max(50),
  municipio: Joi.string().max(50),
  colonia: Joi.string().max(50),
  direccion: Joi.string().max(255),
});

// Esquema de validación para la actualización de una persona con PATCH
const personaSchemaUpdate = Joi.object({
  carnet_identidad: Joi.string().max(20).optional(),
  nombre: Joi.string().max(100).optional(),
  apellido1: Joi.string().max(100).optional(),
  apellido2: Joi.string().max(100).optional(),
  fecha_nacimiento: Joi.date().optional(),
  escuela: Joi.string().max(100).optional(),
  telefono: Joi.string().max(20).optional(),
  email: Joi.string().email().optional(),
  departamento: Joi.string().max(50).optional(),
  municipio: Joi.string().max(50).optional(),
  colonia: Joi.string().max(50).optional(),
  direccion: Joi.string().max(255).optional(),
}).min(1); // Asegura que al menos un campo sea proporcionado para la actualización

const personaModel = {
  /**
   * Este método crea una nueva persona en la base de datos. Valida los datos de entrada con personaSchemaCreate
   * antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevaPersona) {
    const { error, value } = personaSchema.validate(nuevaPersona);
    if (error)
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    try {
      const [res] = await db.query('INSERT INTO persona SET ?', value);
      return { idPersona: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear la persona: ${err.message}`);
    }
  },

  /**
   * Este método recupera todas las personas de la base de datos. No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM persona');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener personas: ${err.message}`);
    }
  },

  /**
   * Este método busca una persona por su ID (idPersona) utilizando validación para asegurar que el ID es un número entero válido.
   * Si no se encuentra la persona, lanza un error especificando que la persona no fue encontrada.
   */
  async findById(idPersona) {
    const { error } = Joi.number().integer().required().validate(idPersona);
    if (error) throw new Error('El ID proporcionado es inválido.');
    try {
      const [res] = await db.query(
        'SELECT * FROM persona WHERE idPersona = ?',
        [idPersona]
      );
      if (res.length === 0) throw new Error('Persona no encontrada');
      return res[0];
    } catch (err) {
      throw new Error(`Error al buscar la persona: ${err.message}`);
    }
  },

  /**
   * Este método busca una persona por su carnet de identidad. Valida que el carnet de identidad sea una cadena válida.
   * En caso de no encontrar la persona, se lanza un error específico.
   */
  async findByCarnet(carnet_identidad) {
    const { error } = Joi.string()
      .max(20)
      .required()
      .validate(carnet_identidad);
    if (error)
      throw new Error('El carnet de identidad proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM persona WHERE carnet_identidad = ?',
        [carnet_identidad]
      );
      if (res.length === 0)
        throw new Error(
          'Persona no encontrada con el carnet de identidad proporcionado.'
        );
      return res[0];
    } catch (err) {
      throw new Error(
        'Error al buscar la persona por carnet de identidad: ' + err.message
      );
    }
  },

  /**
   * Este método busca personas por su nombre. Valida que el nombre sea una cadena válida.
   * En caso de no encontrar personas con ese nombre, se lanza un error específico.
   */
  async findByNombre(nombre) {
    const { error } = Joi.string().max(100).required().validate(nombre);
    if (error) throw new Error('El nombre proporcionado es inválido.');

    try {
      const [res] = await db.query('SELECT * FROM persona WHERE nombre = ?', [
        nombre,
      ]);
      if (res.length === 0)
        throw new Error(
          'No se encontraron personas con el nombre proporcionado.'
        );
      return res;
    } catch (err) {
      throw new Error('Error al buscar personas por nombre: ' + err.message);
    }
  },

  /**
   * Este método busca personas por su primer apellido. Valida que el apellido sea una cadena válida.
   * En caso de no encontrar personas con ese apellido, se lanza un error específico.
   */
  async findByApellido1(apellido1) {
    const { error } = Joi.string().max(100).required().validate(apellido1);
    if (error) throw new Error('El apellido1 proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM persona WHERE apellido1 = ?',
        [apellido1]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron personas con el apellido1 proporcionado.'
        );
      return res;
    } catch (err) {
      throw new Error('Error al buscar personas por apellido1: ' + err.message);
    }
  },

  /**
   * Este método busca personas por su segundo apellido. Valida que el apellido sea una cadena válida.
   * En caso de no encontrar personas con ese apellido, se lanza un error específico.
   */
  async findByApellido2(apellido2) {
    const { error } = Joi.string().max(100).allow(null, '').validate(apellido2);
    if (error) throw new Error('El apellido2 proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM persona WHERE apellido2 = ?',
        [apellido2]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron personas con el apellido2 proporcionado.'
        );
      return res;
    } catch (err) {
      throw new Error('Error al buscar personas por apellido2: ' + err.message);
    }
  },

  /**
   * Este método actualiza los datos de una persona por su ID (idPersona) después de validar la entrada con personaSchemaUpdate.
   * Asegura que al menos un campo sea proporcionado para la actualización. Si no se encuentran cambios o la persona
   * no existe, lanza un error.
   */
  async updateById(id, datosPersona) {
    const { error } = personaSchemaUpdate.validate(datosPersona);
    if (error)
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    try {
      const [res] = await db.query('UPDATE persona SET ? WHERE idPersona = ?', [
        datosPersona,
        id,
      ]);
      if (res.affectedRows === 0)
        throw new Error('Persona no encontrada o sin cambios necesarios.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar la persona: ${err.message}`);
    }
  },

  /**
   * Este método elimina una persona por su ID (idPersona) tras validar que el ID sea un número entero válido.
   * Si la persona no existe o no se puede eliminar, lanza un error.
   */
  async remove(id) {
    const { error } = Joi.number().integer().required().validate(id);
    if (error) throw new Error('El ID proporcionado es inválido.');
    try {
      const [res] = await db.query('DELETE FROM persona WHERE idPersona = ?', [
        id,
      ]);
      if (res.affectedRows === 0) throw new Error('Persona no encontrada.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar la persona: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todas las personas ordenadas alfabéticamente por su nombre.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAllSortedByName() {
    try {
      const [res] = await db.query('SELECT * FROM persona ORDER BY nombre ASC');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener personas ordenadas: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todas las personas ordenadas alfabéticamente por su primer apellido y luego por su segundo apellido.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAllSortedByApellidos() {
    try {
      const [res] = await db.query(
        'SELECT * FROM persona ORDER BY apellido1 ASC, apellido2 ASC'
      );
      return res;
    } catch (err) {
      throw new Error(
        `Error al obtener personas ordenadas por apellidos: ${err.message}`
      );
    }
  },
};

module.exports = personaModel;
