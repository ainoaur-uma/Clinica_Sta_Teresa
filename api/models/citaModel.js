const db = require('../../server/db_connection');
const Joi = require('joi');
const pacienteModel = require('./pacienteModel');
const usuarioModel = require('./usuarioModel');

// Esquema de validación para la creación de una cita
const citaSchema = Joi.object({
  fecha: Joi.date().required(),
  hora: Joi.string().required(),
  NHC_paciente: Joi.number().integer().required(),
  doctor_id: Joi.number().integer().required(),
  agenda_id: Joi.number().integer().required(),
  informacion_cita: Joi.string().allow('').optional(),
});

// Esquema de validación para actualización parcial con PATCH
const citaSchemaUpdate = Joi.object({
  fecha: Joi.date().optional(),
  hora: Joi.string().optional(),
  NHC_paciente: Joi.number().integer().optional(),
  doctor_id: Joi.number().integer().optional(),
  agenda_id: Joi.number().integer().optional(),
  informacion_cita: Joi.string().allow('').optional(),
}).min(1); // Requiere al menos un campo para la actualización

const citaModel = {
  /**
   * Crea una nueva cita en la base de datos.
   * Primero verifica que el paciente, el usuario y la agenda existan en la base de datos. Después, valida los datos de entrada con citaSchema antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * Si los datos son válidos, inserta la nueva entrada en la base de datos y devuelve los detalles de la agenda creada.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevaCita) {
    const { error, value } = citaSchema.validate(nuevaCita);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    const pacienteExistente = await db.query(
      'SELECT * FROM paciente WHERE NHC = ?',
      [value.NHC_paciente]
    );
    if (pacienteExistente[0].length === 0) {
      throw new Error('El paciente no existe.');
    }

    const doctorExistente = await db.query(
      'SELECT * FROM usuario WHERE idUsuario = ?',
      [value.doctor_id]
    );
    if (doctorExistente[0].length === 0) {
      throw new Error('El doctor (usuario) no existe.');
    }

    const agendaExistente = await db.query(
      'SELECT * FROM agenda WHERE idAgenda = ?',
      [value.agenda_id]
    );
    if (agendaExistente[0].length === 0) {
      throw new Error('La agenda no existe.');
    }

    try {
      const [res] = await db.query('INSERT INTO cita SET ?', value);
      return { idCita: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear la cita: ${err.message}`);
    }
  },

  /**
   * Obtiene todas las citas de la base de datos.
   * No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [citas] = await db.query('SELECT * FROM cita');
      return citas;
    } catch (err) {
      throw new Error(`Error al obtener las citas: ${err.message}`);
    }
  },

  /**
   * Busca una cita específica por su ID(idCita)
   * Utiliza validación para asegurar que el idCita es un número entero válido antes de realizar la consulta.
   * Si la agenda es encontrada, devuelve los detalles de la entrada. Si no se encuentra, lanza un error especificando que la agenda no fue encontrada.
   * En caso de error en la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async findById(idCita) {
    const { error } = Joi.number().integer().required().validate(idCita);
    if (error) {
      throw new Error('El ID de la cita proporcionado es inválido.');
    }

    try {
      const [cita] = await db.query('SELECT * FROM cita WHERE idCita = ?', [
        idCita,
      ]);
      if (cita.length === 0) throw new Error('Cita no encontrada');
      return cita[0];
    } catch (err) {
      throw new Error(`Error al buscar la cita: ${err.message}`);
    }
  },

  /**
   * Busca las citas de un paciente por su NHC
   * Valida que la descripción proporcionada sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todas las citas que coinciden con el nhc .
   * Si no se encuentran agendas, lanza un error especificando que no se encontraron agendas con esa descripción.
   */
  async findByNhc(NHC_paciente) {
    const { error } = Joi.number().integer().required().validate(NHC_paciente);
    if (error) {
      throw new Error('El NHC proporcionado es inválido.');
    }

    try {
      const [citas] = await db.query(
        'SELECT * FROM cita WHERE NHC_paciente = ?',
        [NHC_paciente]
      );
      if (citas.length === 0)
        throw new Error(
          'No se encontraron citas para el paciente especificado.'
        );
      return citas;
    } catch (err) {
      throw new Error(
        `Error al buscar citas por NHC del paciente: ${err.message}`
      );
    }
  },

  /**
   * Busca las citas de un usuario específico por el id del usuario (idUsuario)
   * Valida que la descripción proporcionada sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todas las citas que coinciden con el nhc .
   * Si no se encuentran agendas, lanza un error especificando que no se encontraron agendas con esa descripción.
   */
  async findByUsuarioId(doctor_id) {
    const { error } = Joi.number().integer().required().validate(doctor_id);
    if (error) {
      throw new Error('El ID del usuario proporcionado es inválido.');
    }

    try {
      const [citas] = await db.query(
        `
        SELECT cita.* FROM cita
        INNER JOIN usuario ON cita.doctor_id = usuario.idUsuario
        WHERE usuario.idUsuario = ?
      `,
        [doctor_id]
      );

      if (citas.length === 0)
        throw new Error('No se encontraron citas para el doctor especificado.');
      return citas;
    } catch (err) {
      throw new Error(
        `Error al buscar citas por ID del doctor: ${err.message}`
      );
    }
  },

  /**
   * Busca las citas de una agenda específica por el id de la Agenda
   * Valida que la descripción proporcionada sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todas las citas que son de la misma agenda
   * Si no se encuentran agendas, lanza un error especificando que no se encontraron agendas con esa descripción.
   */

  async findByAgendaId(agenda_id) {
    const { error } = Joi.number().integer().required().validate(agenda_id);
    if (error) {
      throw new Error('El ID de la agenda proporcionado es inválido.');
    }

    try {
      const [citas] = await db.query('SELECT * FROM cita WHERE agenda_id = ?', [
        agenda_id,
      ]);
      if (citas.length === 0)
        throw new Error('No se encontraron citas para la agenda especificada.');
      return citas;
    } catch (err) {
      throw new Error(
        `Error al buscar citas por ID de la agenda: ${err.message}`
      );
    }
  },

  /**
   * Busca las citas de una agenda específica por el nombre de la Agenda
   * Valida que la descripción proporcionada sea una cadena no vacía antes de realizar la consulta.
   * Devuelve todas las citas que son de la misma agenda
   * Si no se encuentran agendas, lanza un error especificando que no se encontraron agendas con esa descripción.
   */
  async findByNombreAgenda(nombreAgenda) {
    const { error } = Joi.string().required().validate(nombreAgenda);
    if (error) {
      throw new Error('El nombre de la agenda proporcionado es inválido.');
    }

    try {
      const [citas] = await db.query(
        `
        SELECT cita.* FROM cita
        INNER JOIN agenda ON cita.agenda_id = agenda.idAgenda
        WHERE agenda.descripcion LIKE ?
      `,
        [`%${nombreAgenda}%`]
      );

      if (citas.length === 0)
        throw new Error(
          'No se encontraron citas con el nombre de agenda especificado.'
        );
      return citas;
    } catch (err) {
      throw new Error(
        `Error al buscar citas por nombre de la agenda: ${err.message}`
      );
    }
  },

  /**
   * Actualiza una cita por su ID (idCita) utilizando los datos proporcionados.
   * Valida los datos de entrada con `citaSchemaUpdate` asegurando que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o la agenda no existe, lanza un error específico.
   */
  async updateById(idCita, datosCita) {
    const { error, value } = citaSchemaUpdate.validate(datosCita);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('UPDATE cita SET ? WHERE idCita = ?', [
        value,
        idCita,
      ]);
      if (res.affectedRows === 0)
        throw new Error('Cita no encontrada o sin cambios necesarios');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar la cita: ${err.message}`);
    }
  },

  /**
   * Elimina una cita por su ID(idCita).
   * Valida que el idCita sea un número entero válido antes de realizar la eliminación.
   * Si la eliminación es exitosa, devuelve el número de filas afectadas.
   * Si la agenda no se encuentra, lanza un error específico indicando que la agenda no fue encontrada.
   * En caso de error durante la eliminación, lanza una excepción con el mensaje de error correspondiente.
   */
  async removeById(idCita) {
    const { error } = Joi.number().integer().required().validate(idCita);
    if (error) {
      throw new Error('El ID de la cita proporcionado es inválido.');
    }

    try {
      const [res] = await db.query('DELETE FROM cita WHERE idCita = ?', [
        idCita,
      ]);
      if (res.affectedRows === 0) throw new Error('Cita no encontrada');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar la cita: ${err.message}`);
    }
  },
};

module.exports = citaModel;
