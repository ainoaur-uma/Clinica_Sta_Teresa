const db = require('../../server/db_connection');
const Joi = require('joi');
const personaModel = require('./personaModel');

// Esquema de validación para la creación de un paciente
const pacienteSchemaCreate = Joi.object({
  NHC: Joi.number().integer().required(),
  escuela: Joi.number().integer(),
  tutor_info: Joi.string().allow('', null),
  grado: Joi.string().allow('', null).max(50),
  otra_info: Joi.string().allow('', null),
});

// Esquema de validación para la actualización de un paciente con PATCH
const pacienteSchemaUpdate = Joi.object({
  escuela: Joi.number().integer(),
  tutor_info: Joi.string().allow('', null).optional(),
  grado: Joi.string().allow('', null).max(50).optional(),
  otra_info: Joi.string().allow('', null).optional(),
}).min(1);

const pacienteModel = {
  /**
   * Este método crea un nuevo paciente en la base de datos. Primero verifica que la persona asociada exista y luego valida los datos de entrada con pacienteSchemaCreate
   * antes de la inserción para asegurar que todos los campos requeridos estén presentes y sean válidos.
   * En caso de error de validación o inserción, lanza una excepción con el mensaje de error correspondiente.
   */
  async create(nuevoPaciente) {
    try {
      await personaModel.findById(nuevoPaciente.NHC);
    } catch (err) {
      throw new Error(
        `No existe una persona con el ID ${nuevoPaciente.NHC}: ${err.message}`
      );
    }
    const { error, value } = pacienteSchemaCreate.validate(nuevoPaciente);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }
    try {
      const [res] = await db.query('INSERT INTO paciente SET ?', value);
      return { NHC: res.insertId, ...value };
    } catch (err) {
      throw new Error(`Error al crear el paciente: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todos los pacientes de la base de datos. No requiere validación de entrada.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAll() {
    try {
      const [res] = await db.query('SELECT * FROM paciente');
      return res;
    } catch (err) {
      throw new Error(`Error al obtener pacientes: ${err.message}`);
    }
  },

  /**
   * Este método obtiene todos los pacientes junto con sus detalles extendidos de la tabla 'persona'.
   * Realiza una consulta JOIN entre la tabla 'paciente' y la tabla 'persona' para combinar la información requerida.
   * En caso de error durante la consulta, lanza una excepción con el mensaje de error correspondiente.
   */
  async getAllWithDetails() {
    try {
      const query = `
      SELECT 
          pa.NHC,
          pe.carnet_identidad,
          pe.nombre,
          pe.apellido1,
          pe.apellido2,
          pe.fecha_nacimiento,
          es.nombre_escuela AS escuela,  
          pa.tutor_info,
          pe.telefono,
          pe.email,
          pe.departamento,
          pe.municipio, 
          pe.direccion,
          pa.otra_info,
          pa.grado 
      FROM paciente pa
      JOIN persona pe ON pa.NHC = pe.idPersona
      LEFT JOIN escuela es ON pa.escuela = es.idEscuela 
      ORDER BY pe.apellido1, pe.apellido2, pe.nombre;
      `;
      const [results] = await db.query(query);
      if (results.length === 0) throw new Error('No se encontraron pacientes');
      return results;
    } catch (err) {
      throw new Error(
        `Error al obtener los detalles de los pacientes: ${err.message}`
      );
    }
  },

  /**
   * Este método busca un paciente  por su NHC utilizando validación para asegurar que el NHC es un número entero válido.
   * Si no se encuentra el paciente, lanza un error especificando que el paciente no fue encontrado.
   */
  async findByNhc(NHC) {
    const { error } = Joi.number().integer().required().validate(NHC);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }
    try {
      const [res] = await db.query('SELECT * FROM paciente WHERE NHC = ?', [
        NHC,
      ]);
      if (res.length === 0) {
        throw new Error('Paciente no encontrado');
      }
      return res[0];
    } catch (err) {
      throw new Error(`Error al buscar el paciente: ${err.message}`);
    }
  },

  /**
   * Este método devuelve los detalles del paciente que se encuentran en la tabla persona, buscando por su NHC.  Utilizando validación para asegurar que el NHC es un número entero válido.
   * Si no se encuentra el paciente, lanza un error especificando que el paciente no fue encontrado
   */
  async findByNHCWithPersonaDetails(NHC) {
    // Validación del NHC
    const { error } = Joi.number().integer().min(1).required().validate(NHC);
    if (error) throw new Error('NHC proporcionado es inválido.');

    try {
      const query = `
      SELECT p.*, pa.tutor_info, pa.grado, pa.otra_info
      FROM paciente pa
      JOIN persona p ON pa.NHC = p.idPersona
      WHERE pa.NHC = ?
    `;
      const [result] = await db.query(query, [NHC]);
      if (result.length === 0) throw new Error('Paciente no encontrado');
      return result[0];
    } catch (err) {
      throw new Error(
        `Error al buscar el paciente con NHC ${NHC}: ${err.message}`
      );
    }
  },

  /**
   * Este método actualiza un paciente  por su NHC  utilizando los datos proporcionados. Antes de la actualización,
   * valida los datos utilizando `pacienteSchemaUpdate`. Asegura que al menos un campo sea proporcionado para la actualización.
   * Si no se encuentran cambios o el paciente no existe, lanza un error.
   */
  async updateById(NHC, datosPaciente) {
    // Validar los datos de entrada con pacienteSchemaUpdate
    const { error, value } = pacienteSchemaUpdate.validate(datosPaciente);
    if (error) {
      throw new Error(
        `Validación fallida: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    try {
      const [res] = await db.query('UPDATE paciente SET ? WHERE NHC = ?', [
        value,
        NHC,
      ]);
      if (res.affectedRows === 0) {
        throw new Error('Paciente no encontrado o sin cambios necesarios.');
      }
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al actualizar el paciente: ${err.message}`);
    }
  },

  /**
   * Actualiza de forma atómica los datos tanto en la tabla de personas como en la de pacientes.
   * Utiliza transacciones para garantizar que ambas actualizaciones se completen con éxito o, en caso de fallo,
   * se revierten todos los cambios para mantener la consistencia de la base de datos.
   *Primero verifica en el body si hay datos de persona o datos de paciente para actualizar y luego los actualiza
   */
  async updatePersonaYPacienteConTransaccion(
    idPersona,
    datosPersona,
    datosPaciente
  ) {
    const connection = await db.getConnection(); // Obtener una conexión del pool
    try {
      await connection.beginTransaction(); // Iniciar una transacción

      // Verificar si datosPersona tiene propiedades antes de actualizar
      if (Object.keys(datosPersona).length > 0) {
        // Actualizar datos en la tabla persona solo si datosPersona no está vacío
        const [updatePersonaResult] = await connection.query(
          'UPDATE persona SET ? WHERE idPersona = ?',
          [datosPersona, idPersona]
        );
        if (updatePersonaResult.affectedRows === 0) {
          throw new Error(
            'Actualización de persona fallida o sin cambios necesarios.'
          );
        }
      }

      // Verificar si datosPaciente tiene propiedades antes de actualizar
      if (Object.keys(datosPaciente).length > 0) {
        // Actualizar datos en la tabla paciente solo si datosPaciente no está vacío
        const [updatePacienteResult] = await connection.query(
          'UPDATE paciente SET ? WHERE NHC = ?',
          [datosPaciente, idPersona]
        );
        if (updatePacienteResult.affectedRows === 0) {
          throw new Error(
            'Actualización de paciente fallida o sin cambios necesarios.'
          );
        }
      }

      await connection.commit(); // Confirmar la transacción
    } catch (err) {
      await connection.rollback(); // Revertir la transacción en caso de error
      throw err; // Propagar el error para manejo externo
    } finally {
      connection.release(); // Devolver la conexión al pool
    }
  },

  /**
   * Este método elimina un paciente por su NHC tras validar que el ID sea un número entero válido.
   * Si ek paciente no existe o no se puede eliminar, lanza un error.
   */

  async remove(NHC) {
    // Validar NHC como un entero requerido
    const { error } = Joi.number().integer().required().validate(NHC);
    if (error) throw new Error('El NHC proporcionado es inválido.');

    try {
      const [res] = await db.query('DELETE FROM paciente WHERE NHC = ?', [NHC]);
      if (res.affectedRows === 0) {
        throw new Error('Paciente no encontrado.');
      }
      // Devuelve el número de filas afectadas para indicar el éxito de la operación
      return { affectedRows: res.affectedRows };
    } catch (err) {
      throw new Error(`Error al eliminar el paciente: ${err.message}`);
    }
  },
};

module.exports = pacienteModel;
