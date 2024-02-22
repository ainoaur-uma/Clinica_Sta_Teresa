const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de un medicamento
const medicamentoSchema = Joi.object({
  nombre_medicamento: Joi.string().max(100).required(),
  principio_activo: Joi.string().max(100).optional(),
  descripcion_medicamento: Joi.string().optional(),
  fecha_caducidad: Joi.date().optional(),
});

// Esquema de validación para la actualización parcial con PATCH
const medicamentoSchemaUpdate = Joi.object({
  nombre_medicamento: Joi.string().max(100).optional(),
  principio_activo: Joi.string().max(100).optional(),
  descripcion_medicamento: Joi.string().optional(),
  fecha_caducidad: Joi.date().optional(),
}).min(1); // Requiere al menos un campo para la actualización

const medicamentoModel = {
  /**
   * Crea un nuevo medicamento en la base de datos.
   * Valida los datos de entrada con medicamentoSchema antes de la inserción.
   * En caso de error de validación, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevoMedicamento) {
    const { error, value } = medicamentoSchema.validate(nuevoMedicamento);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('INSERT INTO medicamento SET ?', value);
      return { idMedicamento: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear el medicamento: ${err.message}`);
    }
  },

  /**
   * Obtiene todos los medicamentos de la base de datos.
   * No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM medicamento');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener los medicamentos: ${err.message}`);
    }
  },

  /**
   * Busca un medicamento por su ID (idMedicamento).
   * Valida que el idMedicamento sea un número entero válido antes de realizar la consulta.
   * Si no se encuentra el medicamento, lanza un error especificando que no fue encontrado.
   */
  async findById(idMedicamento) {
    const { error } = Joi.number().integer().required().validate(idMedicamento);
    if (error) {
      throw new Error('El ID del medicamento proporcionado es inválido.');
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM medicamento WHERE idMedicamento = ?',
        [idMedicamento]
      );
      if (res.length === 0) {
        throw new Error('Medicamento no encontrado');
      }
      return res[0];
    } catch (err) {
      throw new Error(`Error al buscar el medicamento: ${err.message}`);
    }
  },

  /**
   * Este método busca medicamentos por su nombre. Valida que el nombre sea una cadena válida.
   * En caso de no encontrar medicamentos con ese nombre, se lanza un error específico.
   */
  async findByNombre(nombreMedicamento) {
    const { error } = Joi.string()
      .max(100)
      .required()
      .validate(nombreMedicamento);
    if (error)
      throw new Error('El nombre del medicamento proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM medicamento WHERE nombre_medicamento LIKE ?',
        [`%${nombreMedicamento}%`]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron medicamentos con el nombre proporcionado.'
        );
      return res;
    } catch (err) {
      throw new Error(
        'Error al buscar medicamentos por nombre: ' + err.message
      );
    }
  },

  /**
   * Busca medicamentos por su principio activo.
   * Valida que el principio activo proporcionado sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todos los medicamentos que coinciden con el principio activo proporcionado.
   * Si no se encuentran medicamentos, lanza un error especificando que no se encontraron resultados.
   */
  async findByPrincipioActivo(principioActivo) {
    const { error } = Joi.string().min(1).required().validate(principioActivo);
    if (error) {
      throw new Error('El principio activo proporcionado es inválido.');
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM medicamento WHERE principio_activo LIKE ?',
        [`%${principioActivo}%`]
      );
      if (res.length === 0) {
        throw new Error(
          'No se encontraron medicamentos con el principio activo proporcionado.'
        );
      }
      return res;
    } catch (err) {
      throw new Error(
        `Error al buscar medicamentos por principio activo: ${err.message}`
      );
    }
  },

  /**
   * Actualiza un medicamento por su ID (idMedicamento) con los datos proporcionados.
   * Valida los datos de entrada con medicamentoSchemaUpdate asegurando que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o el medicamento no existe, lanza un error específico.
   */
  async updateById(idMedicamento, datosMedicamento) {
    const { error, value } = medicamentoSchemaUpdate.validate(datosMedicamento);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'UPDATE medicamento SET ? WHERE idMedicamento = ?',
        [value, idMedicamento]
      );
      if (res.affectedRows === 0)
        throw new Error('Medicamento no encontrado o sin cambios necesarios');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar el medicamento: ${err.message}`);
    }
  },

  /**
   * Elimina un medicamento por su ID (idMedicamento).
   * Valida que el idMedicamento sea un número entero válido antes de realizar la eliminación.
   * Si el medicamento no existe, lanza un error específico.
   */
  async removeById(idMedicamento) {
    const { error } = Joi.number().integer().required().validate(idMedicamento);
    if (error) {
      throw new Error('El ID del medicamento proporcionado es inválido.');
    }

    try {
      const [res] = await db.query(
        'DELETE FROM medicamento WHERE idMedicamento = ?',
        [idMedicamento]
      );
      if (res.affectedRows === 0) throw new Error('Medicamento no encontrado');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar el medicamento: ${err.message}`);
    }
  },
};

module.exports = medicamentoModel;
