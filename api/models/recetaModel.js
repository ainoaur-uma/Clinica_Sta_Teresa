const db = require('../../server/db_connection');
const Joi = require('joi');
const medicamentoModel = require('./medicamentoModel');
const personaModel = require('./personaModel');
const pacienteModel = require('./pacienteModel');
const usuarioModel = require('./usuarioModel');

// Esquema de validación para la creación de una receta
const recetaSchema = Joi.object({
  nhc_paciente: Joi.number().integer().required(),
  id_medicamento: Joi.number().integer().required(),
  id_medico: Joi.number().integer().required(),
  fecha_receta: Joi.date().required(),
  recomendaciones: Joi.string().allow('').optional(),
});

// Esquema de validación para la actualización parcial de una receta con PATCH
const recetaSchemaUpdate = Joi.object({
  nhc_paciente: Joi.number().integer().optional(),
  id_medicamento: Joi.number().integer().optional(),
  id_medico: Joi.number().integer().optional(),
  fecha_receta: Joi.date().optional(),
  recomendaciones: Joi.string().allow('').optional(),
}).min(1); // Requiere al menos un campo para la actualización

const recetaModel = {
  /**
   * Crea una nueva receta en la base de datos.Primero verifica que el medicamento asociado exista y luego valida los datos de entrada con inventarioSchemaCreate
   * antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * Valida los datos de entrada con recetaSchema antes de la inserción.
   * En caso de error de validación, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevaReceta) {
    // Verificar la existencia del paciente, médico y medicamento antes de proceder
    try {
      await pacienteModel.findByNhc(nuevaReceta.nhc_paciente);
    } catch (err) {
      throw new Error(
        `No existe un paciente con el NHC ${nuevaReceta.nhc_paciente}: ${err.message}`
      );
    }

    try {
      await medicamentoModel.findById(nuevaReceta.id_medicamento);
    } catch (err) {
      throw new Error(
        `No existe un medicamento con el ID ${nuevaReceta.id_medicamento}: ${err.message}`
      );
    }

    try {
      await usuarioModel.findById(nuevaReceta.id_medico);
    } catch (err) {
      throw new Error(
        `No existe un médico con el ID ${nuevaReceta.id_medico}: ${err.message}`
      );
    }

    // Validar los datos de la nueva receta
    const { error, value } = recetaSchema.validate(nuevaReceta);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    // Inserción de la receta en la base de datos
    try {
      const [res] = await db.query('INSERT INTO receta SET ?', value);
      return { idReceta: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear la receta: ${err.message}`);
    }
  },

  /**
   * Obtiene todas las recetas de la base de datos.
   * No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM receta');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener las recetas: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todas las recetas  junto con el nombre del medicamento, el nombre del paciente, los apellidos
   * Realiza un JOIN con la tabla `medicamentos`  y con la tabla persona para obtener el nombre del medicamento.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAllWithDetails() {
    try {
      const query = `
      SELECT 
      r.idReceta,
      p.nombre AS nombrePaciente,
      p.apellido1 AS apellido1Paciente,
      m.nombre_medicamento,
      u.nombre_usuario AS nombreMedico,
      r.fecha_receta,
      r.recomendaciones
    FROM 
      receta AS r
    JOIN 
      persona AS p ON r.nhc_paciente = p.idPersona
    JOIN 
      medicamento AS m ON r.id_medicamento = m.idMedicamento
    JOIN 
      usuario AS u ON r.id_medico = u.idUsuario;
      `;
      const [results] = await db.query(query);
      if (results.length === 0) {
        throw new Error('No se encontraron recetas con detalles completos.');
      }
      return results;
    } catch (err) {
      throw new Error(`Error al obtener recetas con detalles: ${err.message}`);
    }
  },

  /**
   * Busca una receta por su ID.
   * Valida que el ID sea un número entero válido antes de realizar la consulta.
   * En caso de error de validación o si la receta no se encuentra, lanza un error.
   */
  async findById(idReceta) {
    const { error } = Joi.number().integer().required().validate(idReceta);
    if (error) {
      throw new Error('El ID de la receta proporcionado es inválido.');
    }

    try {
      const [res] = await db.query('SELECT * FROM receta WHERE idReceta = ?', [
        idReceta,
      ]);
      if (res.length === 0) {
        throw new Error('Receta no encontrada');
      }
      return res[0];
    } catch (err) {
      throw new Error(`Error al buscar la receta: ${err.message}`);
    }
  },

  /**
   * Busca recetas por el NHC del paciente.
   * Valida que el NHC sea un número entero válido antes de realizar la consulta.
   * En caso de no encontrar recetas, lanza un error específico.
   */
  async findByNhc(nhc_paciente) {
    const { error } = Joi.number().integer().required().validate(nhc_paciente);
    if (error) {
      throw new Error('El NHC proporcionado es inválido.');
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM receta WHERE nhc_paciente = ?',
        [nhc_paciente]
      );
      if (res.length === 0) {
        throw new Error('No se encontraron recetas para el paciente.');
      }
      return res;
    } catch (err) {
      throw new Error(`Error al buscar las recetas por NHC: ${err.message}`);
    }
  },

  /**
   * Busca recetas por el ID del medicamento.
   * Valida que el ID sea un número entero válido antes de realizar la consulta.
   * En caso de no encontrar recetas, lanza un error específico.
   */
  async findByMedicamentoId(idMedicamento) {
    const { error } = Joi.number().integer().required().validate(idMedicamento);
    if (error) {
      throw new Error('El ID del medicamento proporcionado es inválido.');
    }

    try {
      const [res] = await db.query(
        'SELECT * FROM receta WHERE id_medicamento = ?',
        [idMedicamento]
      );
      if (res.length === 0) {
        throw new Error('No se encontraron recetas para el medicamento.');
      }
      return res;
    } catch (err) {
      throw new Error(
        `Error al buscar las recetas por ID de medicamento: ${err.message}`
      );
    }
  },

  /**
   * Este método actualiza una receta por su idReceta  utilizando los datos proporcionados. Antes de la actualización,
   * valida los datos utilizando `recetaSchemaUpdate`. Asegura que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o la receta no existe, lanza un error.
   */
  async updateById(idReceta, datosReceta) {
    // Primero, valida que el ID de la receta sea un número entero válido.
    const idValidation = Joi.number().integer().required().validate(idReceta);
    if (idValidation.error) {
      throw new Error(
        `El ID de la receta es inválido: ${idValidation.error.details
          .map((x) => x.message)
          .join(', ')}`
      );
    }

    // Luego, valida los datos de actualización utilizando un esquema de validación específico para la actualización.
    const { error, value } = recetaSchemaUpdate.validate(datosReceta);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('UPDATE receta SET ? WHERE idReceta = ?', [
        value,
        idReceta,
      ]);
      if (res.affectedRows === 0) {
        throw new Error('Receta no encontrada o sin cambios necesarios.');
      }
      // Devuelve un objeto que incluye el ID de la receta y los campos actualizados para confirmar la actualización.
      return { idReceta, ...value };
    } catch (err) {
      throw new Error(`Error al actualizar la receta: ${err.message}`);
    }
  },

  /**
   * Elimina una receta por su ID.
   * Valida que el ID sea un número entero válido antes de realizar la eliminación.
   * En caso de no encontrar la receta, lanza un error específico.
   */
  async removeById(idReceta) {
    const { error } = Joi.number().integer().required().validate(idReceta);
    if (error) {
      throw new Error('El ID de la receta proporcionado es inválido.');
    }

    try {
      const [res] = await db.query('DELETE FROM receta WHERE idReceta = ?', [
        [idReceta],
      ]);
      if (res.affectedRows === 0) {
        throw new Error('Receta no encontrada.');
      }
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar la receta: ${err.message}`);
    }
  },
};

module.exports = recetaModel;
