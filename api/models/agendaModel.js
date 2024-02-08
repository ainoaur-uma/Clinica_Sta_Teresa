const db = require('../../server/db_connection');
const Joi = require('joi');

// Esquema de validación para la creación de una agenda
const agendaSchema = Joi.object({
  descripcion: Joi.string().required(),
  horario: Joi.string().required(),
});

// Esquema de validación para actualizaciones parciales con PATCH
const agendaSchemaUpdate = Joi.object({
  descripcion: Joi.string().optional(),
  horario: Joi.string().optional(),
}).min(1); // Asegura que al menos un campo sea proporcionado para la actualización.

const AgendaModel = {
  /**
   * Crea una nueva entrada en la agenda en la base de datos.
   * Valida los datos de entrada con agendaSchema antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * Si los datos son válidos, inserta la nueva entrada en la base de datos y devuelve los detalles de la agenda creada.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevaAgenda) {
    const { error, value } = agendaSchema.validate(nuevaAgenda);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('INSERT INTO agenda SET ?', value);
      return { idAgenda: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear la agenda: ${err.message}`);
    }
  },

  /**
   * Obtiene todas las entradas de agendas de la base de datos.
   * No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [agendaa] = await db.query('SELECT * FROM agenda');
      return agendaa;
    } catch (err) {
      throw new Error(`Error al obtener las agendas: ${err.message}`);
    }
  },

  /**
   * Busca una entrada de agenda específica por su ID(idAgenda)
   * Utiliza validación para asegurar que el idAgenda es un número entero válido antes de realizar la consulta.
   * Si la agenda es encontrada, devuelve los detalles de la entrada. Si no se encuentra, lanza un error especificando que la agenda no fue encontrada.
   * En caso de error en la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async findById(idAgenda) {
    const { error } = Joi.number().integer().required().validate(idAgenda);
    if (error) {
      throw new Error('El ID de la agenda proporcionado es inválido.');
    }

    try {
      const [agenda] = await db.query(
        'SELECT * FROM agenda WHERE idAgenda = ?',
        [idAgenda]
      );
      if (agenda.length === 0) throw new Error('Agenda no encontrada');
      return agenda[0];
    } catch (err) {
      throw new Error(`Error al buscar la agenda: ${err.message}`);
    }
  },

  /**
   * Busca agendas por su descripción.
   * Valida que la descripción proporcionada sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todas las agendas que coinciden con la descripción proporcionada.
   * Si no se encuentran agendas, lanza un error especificando que no se encontraron agendas con esa descripción.
   */
  async findByDescripcion(descripcion) {
    const { error } = Joi.string().min(1).required().validate(descripcion);
    if (error) {
      throw new Error('La descripción proporcionada es inválida.');
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM agenda WHERE descripcion LIKE ?',
        [`%${descripcion}%`]
      );
      if (res.length === 0) {
        throw new Error(
          'No se encontraron agenda con la descripción proporcionada.'
        );
      }
      return res;
    } catch (err) {
      throw new Error(`Error al buscar agenda por descripción: ${err.message}`);
    }
  },

  /**
   * Actualiza una agenda por su ID utilizando los datos proporcionados.
   * Valida los datos de entrada con `agendaSchemaUpdate` asegurando que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o la agenda no existe, lanza un error específico.
   */
  async updateById(idAgenda, datosAgenda) {
    const { error, value } = agendaSchemaUpdate.validate(datosAgenda);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('UPDATE agenda SET ? WHERE idAgenda = ?', [
        value,
        idAgenda,
      ]);
      if (res.affectedRows === 0) {
        throw new Error('Agenda no encontrada o sin cambios necesarios');
      }
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar la agenda: ${err.message}`);
    }
  },

  /**
   * Elimina una agenda por su ID.
   * Valida que el idAgenda sea un número entero válido antes de realizar la eliminación.
   * Si la eliminación es exitosa, devuelve el número de filas afectadas.
   * Si la agenda no se encuentra, lanza un error específico indicando que la agenda no fue encontrada.
   * En caso de error durante la eliminación, lanza una excepción con el mensaje de error correspondiente.
   */
  async removeById(idAgenda) {
    const { error } = Joi.number().integer().required().validate(idAgenda);
    if (error) {
      throw new Error('El ID de la agenda proporcionado es inválido.');
    }

    try {
      const [res] = await db.query('DELETE FROM agenda WHERE idAgenda = ?', [
        idAgenda,
      ]);
      if (res.affectedRows === 0) throw new Error('Agenda no encontrada.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar la agenda: ${err.message}`);
    }
  },
};

module.exports = AgendaModel;
