const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de un episodio
const episodioSchema = Joi.object({
  NHC_paciente: Joi.number().integer().required(),
  Medico: Joi.number().integer().required(),
  fecha_episodio: Joi.date().optional(),
  tipo_asistencia: Joi.string().max(20).optional(),
  motivo_consulta: Joi.string().optional(),
  anamnesis: Joi.string().optional(),
  diagnostico: Joi.string().optional(),
  tratamiento: Joi.string().optional(),
  peso: Joi.number().precision(2).allow(null).optional(),
  pa: Joi.number().precision(2).allow(null).optional(),
  spo2: Joi.number().precision(2).allow(null).optional(),
});

// Esquema de validación para actualización parcial con PATCH
const episodioSchemaUpdate = Joi.object({
  NHC_paciente: Joi.number().integer().required(),
  Medico: Joi.number().integer().optional(),
  fecha_episodio: Joi.date().optional(),
  tipo_asistencia: Joi.string().max(20).optional(),
  motivo_consulta: Joi.string().optional(),
  anamnesis: Joi.string().optional(),
  diagnostico: Joi.string().optional(),
  tratamiento: Joi.string().optional(),
  peso: Joi.number().precision(2).allow(null).optional(),
  pa: Joi.number().precision(2).allow(null).optional(),
  spo2: Joi.number().precision(2).allow(null).optional(),
}).min(1); // Requiere al menos un campo para la actualización

const episodioModel = {
  /**
   * Este método crea un nuevo episodio en la base de datos.
   * Primero valida los datos de entrada con episodioSchema antes de la inserción.
   * En caso de error de validación, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevoEpisodio) {
    const { error, value } = episodioSchema.validate(nuevoEpisodio);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('INSERT INTO episodio SET ?', value);
      return { idEpisodio: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear el episodio: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todos los episodios de la base de datos. No requiere validación.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM episodio');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener episodios: ${err.message}`);
    }
  },

  /**
   * Este método busca un episodio por su ID (idEpisodio).
   * Valida que el idEpisodio sea un número entero válido antes de realizar la consulta.
   * En caso de no encontrar el episodio, lanza un error especificando que el episodio no fue encontrado.
   */
  async findById(idEpisodio) {
    const { error } = Joi.number().integer().required().validate(idEpisodio);
    if (error) throw new Error('El idEpisodio proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM episodio WHERE idEpisodio = ?',
        [idEpisodio]
      );
      if (res.length === 0) throw new Error('Episodio no encontrado');
      return res[0];
    } catch (err) {
      throw new Error(`Error al buscar el episodio: ${err.message}`);
    }
  },

  /**
   * Este método busca todos los episodios relacionados con un paciente mediante su NHC.
   * Valida que el NHC sea un número entero válido antes de realizar la consulta.
   * Si no se encuentran episodios, lanza un error especificando que no hay episodios para el paciente.
   */
  async findByNHC(NHC_paciente) {
    const { error } = Joi.number().integer().required().validate(NHC_paciente);
    if (error) throw new Error('El NHC proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM episodio WHERE NHC_paciente = ?',
        [NHC_paciente]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron episodios para el NHC proporcionado'
        );
      return res;
    } catch (err) {
      throw new Error(
        `Error al buscar episodios por NHC de paciente: ${err.message}`
      );
    }
  },

  /**
   * Actualiza un episodio por su ID (idEpisodio) utilizando los datos proporcionados.
   * Valida los datos de entrada con `episodioSchemaUpdate` asegurando que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o el episodio no existe, lanza un error específico.
   */
  async updateById(idEpisodio, datosEpisodio) {
    const { error, value } = episodioSchemaUpdate.validate(datosEpisodio);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'UPDATE episodio SET ? WHERE idEpisodio = ?',
        [value, idEpisodio]
      );
      if (res.affectedRows === 0)
        throw new Error('Episodio no encontrado o sin cambios necesarios');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar el episodio: ${err.message}`);
    }
  },

  /**
   * Este método elimina un episodio por su ID (idEpisodio).
   * Valida que el idEpisodio sea un número entero válido antes de realizar la eliminación.
   * Si el episodio no existe, lanza un error específico.
   */
  async removeById(idEpisodio) {
    const { error } = Joi.number().integer().required().validate(idEpisodio);
    if (error)
      throw new Error('El  ID del Episodio proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'DELETE FROM episodio WHERE idEpisodio = ?',
        [idEpisodio]
      );
      if (res.affectedRows === 0) throw new Error('Episodio no encontrado');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar el episodio: ${err.message}`);
    }
  },
};

module.exports = episodioModel;
