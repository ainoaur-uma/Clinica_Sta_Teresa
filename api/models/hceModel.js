const db = require('../../server/db_connection');
const Joi = require('joi');
const pacienteModel = require('./pacienteModel');

// Esquema de validación para la creación de una HCE
const hceSchema = Joi.object({
  NHC_paciente: Joi.number().integer().required(),
  sexo: Joi.string().valid('F', 'M').max(10).allow(null, ''),
  grupo_sanguineo: Joi.string().max(10).allow(null, ''),
  alergias: Joi.string().allow(null, ''),
  antecedentes_clinicos: Joi.string().allow(null, ''),
});

const hceSchemaUpdate = Joi.object({
  sexo: Joi.string().valid('F', 'M').max(10).allow(null, '').optional(),
  grupo_sanguineo: Joi.string().max(10).allow(null, '').optional(),
  alergias: Joi.string().allow(null, '').optional(),
  antecedentes_clinicos: Joi.string().allow(null, '').optional(),
}).min(1); // Asegura que al menos un campo sea proporcionado para la actualización.

const hceModel = {
  /**
   * Este método crea una nueva Historia Clínica Electrónica (HCE) en la base de datos.
   * Primero verifica que el paciente asociado exista y luego valida los datos de entrada con hceSchema
   * antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(newHCE) {
    // Validar la existencia del paciente asociado
    try {
      await pacienteModel.findByNhc(newHCE.NHC_paciente);
    } catch (err) {
      throw new Error(
        `No existe un paciente con el NHC ${newHCE.NHC_paciente}: ${err.message}`
      );
    }

    const { error, value } = hceSchema.validate(newHCE);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      await db.query('INSERT INTO hce SET ?', value);
      return { ...value };
    } catch (err) {
      throw new Error(`Error al crear la HCE: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todas las Historias Clínicas Electrónicas (HCEs) de la base de datos.
   * Este método no requiere validación de entrada.
   * En caso de éxito, devuelve un arreglo de todas las HCEs encontradas.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM hce');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener todas las HCEs: ${err.message}`);
    }
  },

  /**
   * Este método obtiene la Historia Clínica Electrónica (HCE) de un paciente específico por su NHC.
   * Valida que el NHC sea un número entero válido antes de realizar la consulta.
   * En caso de no encontrar la HCE, lanza un error especificando que la HCE no fue encontrada.
   */
  async findByPacienteNHC(NHC_paciente) {
    const { error } = Joi.number().integer().required().validate(NHC_paciente);
    if (error) throw new Error('El NHC proporcionado es inválido.');

    try {
      const [result] = await db.query(
        'SELECT * FROM hce WHERE NHC_paciente = ?',
        [NHC_paciente]
      );
      if (result.length === 0)
        throw new Error(
          'HCE no encontrada para el paciente con el NHC proporcionado'
        );
      return result[0];
    } catch (err) {
      throw new Error(`Error al buscar la HCE: ${err.message}`);
    }
  },

  /**
   * Actualiza la Historia Clínica Electrónica (HCE) de un paciente específico por su NHC con los datos proporcionados.
   * Antes de la actualización, valida los datos utilizando `hceSchema`.
   * Si no se encuentran cambios o el paciente no existe, lanza un error.
   */
  async updateByPacienteNHC(NHC_paciente, datosHCE) {
    const { error, value } = hceSchema.validate(datosHCE);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [result] = await db.query(
        'UPDATE hce SET ? WHERE NHC_paciente = ?',
        [value, NHC_paciente]
      );
      if (result.affectedRows === 0)
        throw new Error(
          'HCE no encontrada o sin cambios necesarios para el paciente con el NHC proporcionado'
        );
      return { NHC_paciente, ...value };
    } catch (err) {
      throw new Error(`Error al actualizar la HCE: ${err.message}`);
    }
  },

  /**
   * Elimina la Historia Clínica Electrónica (HCE) de un paciente específico por su NHC.
   * Valida que el NHC sea un número entero válido antes de ejecutar la eliminación.
   * Si la HCE no existe, lanza un error indicando que no se encontró.
   */
  async removeByPacienteNHC(NHC_paciente) {
    const { error } = Joi.number().integer().required().validate(NHC_paciente);
    if (error) throw new Error('El NHC proporcionado es inválido.');

    try {
      const [result] = await db.query(
        'DELETE FROM hce WHERE NHC_paciente = ?',
        [NHC_paciente]
      );
      if (result.affectedRows === 0)
        throw new Error(
          'HCE no encontrada para el paciente con el NHC proporcionado'
        );
      return { mensaje: 'HCE eliminada exitosamente.' };
    } catch (err) {
      throw new Error(`Error al eliminar la HCE: ${err.message}`);
    }
  },
};

module.exports = hceModel;
