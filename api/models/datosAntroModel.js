const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de un registro antropométrico
const datosAntropometricosSchema = Joi.object({
  NHC_paciente: Joi.number().integer().required(),
  fecha_registro: Joi.date().required(),
  peso: Joi.number().precision(2).allow(null).optional(),
  altura: Joi.number().precision(2).allow(null).optional(),
  IMC: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cintura: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cadera: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cabeza: Joi.number().precision(2).allow(null).optional(),
});

// Esquema de validación para la actualización parcial con PATCH
const datosAntropometricosSchemaUpdate = Joi.object({
  NHC_paciente: Joi.number().integer().required(),
  fecha_registro: Joi.date().required(),
  peso: Joi.number().precision(2).allow(null).optional(),
  altura: Joi.number().precision(2).allow(null).optional(),
  IMC: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cintura: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cadera: Joi.number().precision(2).allow(null).optional(),
  circunferencia_cabeza: Joi.number().precision(2).allow(null).optional(),
}).min(1); // Asegura que al menos un campo sea proporcionado para la actualización

const datosAntropometricosModel = {
  /**
   * Crea un nuevo registro antropométrico en la base de datos.
   * Valida los datos de entrada con datosAntropometricosSchema antes de la inserción.
   * En caso de error de validación, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevoDatoAntropometrico) {
    const { error, value } = datosAntropometricosSchema.validate(
      nuevoDatoAntropometrico
    );
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'INSERT INTO datos_antropometricos SET ?',
        value
      );
      return { idDatoAntropometrico: res.insertId, ...value };
    } catch (err) {
      throw new Error(
        `Error al crear el registro antropométrico: ${err.message}`
      );
    }
  },

  /**
   * Obtiene todos los registros antropométricos de la base de datos.
   * No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM datos_antropometricos');
      return res;
    } catch (err) {
      throw new Error(
        `Error al obtener los registros antropométricos: ${err.message}`
      );
    }
  },

  /**
   * Busca un registro antropométrico por su ID (idDatoAntropometrico)
   * Valida que el idDatoAntropometrico sea un número entero válido antes de realizar la consulta.
   * Si no se encuentra el registro, lanza un error especificando que no fue encontrado.
   */
  async findById(idDatoAntropometrico) {
    const { error } = Joi.number()
      .integer()
      .required()
      .validate(idDatoAntropometrico);
    if (error) {
      throw new Error(
        'El ID del dato antropométrico proporcionado es inválido.'
      );
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM datos_antropometricos WHERE idDatoAntropometrico = ?',
        [idDatoAntropometrico]
      );
      if (res.length === 0)
        throw new Error('Registro antropométrico no encontrado');
      return res[0];
    } catch (err) {
      throw new Error(
        `Error al buscar el registro antropométrico: ${err.message}`
      );
    }
  },

  /**
   * Este método busca todos los registros antropométricos relacionados con un paciente mediante su NHC.
   * Valida que el NHC sea un número entero válido antes de realizar la consulta.
   * Si no se encuentran registros, lanza un error especificando que no hay datos antropométricos para el paciente.
   */
  async findByNHC(NHC_paciente) {
    const { error } = Joi.number().integer().required().validate(NHC_paciente);
    if (error) throw new Error('El NHC proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM datos_antropometricos WHERE NHC_paciente = ?',
        [NHC_paciente]
      );
      if (res.length === 0) {
        throw new Error(
          'No se encontraron datos antropométricos para el NHC proporcionado'
        );
      }
      return res;
    } catch (err) {
      throw new Error(
        `Error al buscar datos antropométricos por NHC de paciente: ${err.message}`
      );
    }
  },

  /**
   * Actualiza un registro antropométrico por su ID (idDatoAntropometrico) con los datos proporcionados.
   * Valida los datos de entrada con datosAntropometricosSchemaUpdate asegurando que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o el registro no existe, lanza un error específico.
   */
  async updateById(idDatoAntropometrico, datosActualizados) {
    const { error, value } =
      datosAntropometricosSchemaUpdate.validate(datosActualizados);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'UPDATE datos_antropometricos SET ? WHERE idDatoAntropometrico = ?',
        [value, idDatoAntropometrico]
      );
      if (res.affectedRows === 0)
        throw new Error(
          'Registro antropométrico no encontrado o sin cambios necesarios'
        );
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(
        `Error al actualizar el registro antropométrico: ${err.message}`
      );
    }
  },

  /**
   * Elimina un registro antropométrico por su ID (idDatoAntropometrico)
   * Valida que el idDatoAntropometrico sea un número entero válido antes de realizar la eliminación.
   * Si el registro no existe, lanza un error específico.
   */
  async removeById(idDatoAntropometrico) {
    const { error } = Joi.number()
      .integer()
      .required()
      .validate(idDatoAntropometrico);
    if (error) {
      throw new Error(
        'El ID del dato antropométrico proporcionado es inválido.'
      );
    }

    try {
      const [res] = await db.query(
        'DELETE FROM datos_antropometricos WHERE idDatoAntropometrico = ?',
        [idDatoAntropometrico]
      );
      if (res.affectedRows === 0)
        throw new Error('Registro antropométrico no encontrado');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(
        `Error al eliminar el registro antropométrico: ${err.message}`
      );
    }
  },
};

module.exports = datosAntropometricosModel;
