const datosAntropometricosModel = require('../models/datosAntroModel');
const pacienteModel = require('../models/pacienteModel');

const datosAntropometricosController = {
  /**
   * Crea un nuevo registro antropométrico. Valida y recibe los datos desde el cuerpo de la solicitud HTTP.
   * Verifica la existencia del paciente antes de crear el registro.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del registro creado.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevoDatoAntropometrico = req.body;
      await pacienteModel.findByNhc(nuevoDatoAntropometrico.NHC_paciente);
      const datoAntropometricoCreado = await datosAntropometricosModel.create(
        nuevoDatoAntropometrico
      );
      res.status(201).json(datoAntropometricoCreado);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al crear el registro antropométrico',
        error: err.message,
      });
    }
  },

  /**
   * Recupera todos los registros antropométricos de la base de datos. No requiere parámetros.
   * Devuelve una lista de registros con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const datos = await datosAntropometricosModel.getAll();
      res.status(200).json(datos);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener los registros antropométricos',
        error: err.message,
      });
    }
  },

  /**
   * Este método obtiene un registro antropométrico específico por su ID (idDatoAntropometrico).
   * El idDatoAntropometrico se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del registro antropométrico con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar el registro, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idDatoAntropometrico = req.params.idDatoAntropometrico;
    try {
      const datoAntropometrico = await datosAntropometricosModel.findById(
        idDatoAntropometrico
      );
      if (!datoAntropometrico) {
        return res.status(404).json({
          mensaje: `Registro antropométrico con ID ${idDatoAntropometrico} no encontrado`,
        });
      }
      res.status(200).json(datoAntropometrico);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener el registro antropométrico con ID ${idDatoAntropometrico}`,
        error: err.message,
      });
    }
  },

  /**
   * Obtiene todos los registros antropométricos de un paciente específico por su NHC.
   * El NHC se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve una lista de registros con una respuesta de estado 200 si se encuentran.
   * En caso de no encontrar registros para el paciente, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByNHC(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    try {
      const datos = await datosAntropometricosModel.findByNHC(NHC_paciente);
      if (datos.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron datos antropométricos para el paciente con NHC ${NHC_paciente}`,
        });
      }
      res.status(200).json(datos);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener los datos antropométricos para el paciente con NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /**
   * Actualiza un registro antropométrico específico por su ID con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Verifica primero la existencia del registro asociado al paciente.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el registro, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idDatoAntropometrico = req.params.idDatoAntropometrico;
    const updatedData = req.body;
    try {
      const result = await datosAntropometricosModel.updateById(
        idDatoAntropometrico,
        updatedData
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Registro antropométrico con ID ${idDatoAntropometrico} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Registro antropométrico con ID ${idDatoAntropometrico} actualizado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar el registro antropométrico con ID ${idDatoAntropometrico}`,
        error: err.message,
      });
    }
  },

  /**
   * Elimina un registro antropométrico específico por su ID(idDatoAntropometrico). El idDatoAntropometrico se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el registro a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idDatoAntropometrico = req.params.idDatoAntropometrico;
    try {
      const result = await datosAntropometricosModel.removeById(
        idDatoAntropometrico
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Registro antropométrico con ID ${idDatoAntropometrico} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Registro antropométrico con ID ${idDatoAntropometrico} eliminado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar el registro antropométrico con ID ${idDatoAntropometrico}`,
        error: err.message,
      });
    }
  },
};

module.exports = datosAntropometricosController;
