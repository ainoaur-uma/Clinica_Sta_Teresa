const db = require('../../server/db_connection');
const Joi = require('joi');
const medicamentoModel = require('./medicamentoModel');

// Esquema de validación para la creación de un registro en el inventario
const inventarioSchemaCreate = Joi.object({
  idMedicamento: Joi.number().integer().required(),
  cantidad_actual: Joi.number().integer().min(0).required(),
  fecha_registro: Joi.date().required(),
});

// Esquema de validación para la actualización parcial de un registro en el inventario con PATCH
const inventarioSchemaUpdate = Joi.object({
  cantidad_actual: Joi.number().integer().min(0).optional(),
  fecha_registro: Joi.date().optional(),
}).min(1); // Requiere al menos un campo para la actualización

const InventarioMedicamentosModel = {
  /**
   * Este método crea un nuevo registro de inventario en la base de datos. Primero verifica que el medicamento asociado exista y luego valida los datos de entrada con inventarioSchemaCreate
   * antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevoRegistroInventario) {
    try {
      // Verificar la existencia del medicamento
      await medicamentoModel.findById(nuevoRegistroInventario.idMedicamento);
    } catch (err) {
      throw new Error(
        `No existe un medicamento con el ID ${nuevoRegistroInventario.idMedicamento}: ${err.message}`
      );
    }

    // Validar los datos del nuevo registro de inventario
    const { error, value } = inventarioSchemaCreate.validate(
      nuevoRegistroInventario
    );
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'INSERT INTO inventario_medicamentos SET ?',
        value
      );
      // Asignar el idInventario al objeto de respuesta (si tu DB lo soporta)
      return { idInventario: res.insertId, ...value };
    } catch (err) {
      throw new Error(
        `Error al crear el registro de inventario: ${err.message}`
      );
    }
  },

  /**
   * Este método obtiene todos los registros de Medicamentos  de la base de datos. No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM inventario_medicamentos');
      return res;
    } catch (err) {
      throw new Error(
        `Error al obtener registros de inventario: ${err.message}`
      );
    }
  },

  /**
   * Este método busca un registro de inventario por su ID (idInventario). Utiliza validación para asegurar que el idInventario es un número entero válido.
   * Si no se encuentra el registro, lanza un error especificando que el registro de inventario no fue encontrado.
   */
  async findById(idInventario) {
    const { error } = Joi.number().integer().required().validate(idInventario);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }
    try {
      const [res] = await db.query(
        'SELECT * FROM inventario_medicamentos WHERE idInventario = ?',
        [idInventario]
      );
      if (res.length === 0) {
        throw new Error('Registro de inventario no encontrado');
      }
      return res[0];
    } catch (err) {
      throw new Error(
        `Error al buscar el registro de inventario: ${err.message}`
      );
    }
  },

  /**
   * Este método busca un registro  por su el idMedicamento utilizando validación para asegurar que el idMedicamento es un número entero válido.
   * Si no se encuentra el paciente, lanza un error especificando que el paciente no fue encontrado.
   */
  async findByMedicamentoId(idMedicamento) {
    const { error } = Joi.number().integer().required().validate(idMedicamento);
    if (error)
      throw new Error('El ID del medicamento proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'SELECT * FROM inventario_medicamentos WHERE idMedicamento = ?',
        [idMedicamento]
      );
      if (res.length === 0)
        throw new Error(
          'No se encontraron registros para el medicamento especificado.'
        );
      return res;
    } catch (err) {
      throw new Error(
        `Error al buscar registros de inventario por ID de medicamento: ${err.message}`
      );
    }
  },

  /**
   * Este método actualiza un registro  por su ID (idInventario)  utilizando los datos proporcionados. Antes de la actualización,
   * valida los datos utilizando `pacienteSchemaUpdate`. Asegura que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o el paciente no existe, lanza un error.
   */

  async updateById(idInventario, datosActualizados) {
    // Validar datos de actualización
    const { error, value } = inventarioSchemaUpdate.validate(datosActualizados);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query(
        'UPDATE inventario_medicamentos SET ? WHERE idInventario = ?',
        [value, idInventario]
      );
      if (res.affectedRows === 0)
        throw new Error(
          'Registro de inventario no encontrado o sin cambios necesarios.'
        );
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(
        `Error al actualizar el registro de inventario: ${err.message}`
      );
    }
  },

  /**
   * Este método elimina registri de inventario por su ID (idInventario) tras validar que el ID sea un número entero válido.
   * Si ek paciente no existe o no se puede eliminar, lanza un error.
   */

  async removeById(idInventario) {
    const { error } = Joi.number().integer().required().validate(idInventario);
    if (error)
      throw new Error('El ID de inventario proporcionado es inválido.');

    try {
      const [res] = await db.query(
        'DELETE FROM inventario_medicamentos WHERE idInventario = ?',
        [idInventario]
      );
      if (res.affectedRows === 0)
        throw new Error('Registro de inventario no encontrado.');
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(
        `Error al eliminar el registro de inventario: ${err.message}`
      );
    }
  },
};

module.exports = InventarioMedicamentosModel;
