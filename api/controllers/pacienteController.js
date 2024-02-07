const pacienteModel = require('../models/pacienteModel');
const personaModel = require('../models/personaModel');

const pacienteController = {
  /**
   * Este método crea un nuevo paciente. Recibe los datos de la persona desde el cuerpo de la solicitud HTTP y los valida.
   * Si los datos son válidos, llama al modelo de persona para insertar el nuevo paciente en la base de datos.
   * Devuelve una respuesta con estado 201 y los datos del  paciente creado si es exitoso.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const { NHC, tutor_info, grado, otra_info } = req.body;
      await personaModel.findById(NHC);
      const nuevoPaciente = {
        NHC,
        tutor_info,
        grado,
        otra_info,
      };
      const pacienteCreado = await pacienteModel.create(nuevoPaciente);
      res.status(201).json(pacienteCreado);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear paciente', error: err.message });
    }
  },

  /**
   * Este método recupera todos los pacientesde la base de datos.Llama al método 'getAll' del pacienteModel,
   * que ejecute una consulta SQL para obtener todos los registros de pacientes.
   * Devuelve una lista de pacietes con una respuesta de estado 200.
   * En caso de error, captura la excepción y envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const pacientes = await pacienteModel.getAll();
      res.status(200).json(pacientes);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener pacientes', error: err.message });
    }
  },

  /**
   * Este método obtiene una paciente específico por su NHC
   * El idUsuario se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del paciente con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar al paciente, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const NHC = req.params.NHC;
    try {
      const paciente = await pacienteModel.findByNhc(NHC);
      if (!paciente) {
        return res
          .status(404)
          .json({ mensaje: `Paciente con NHC ${NHC} no encontrado` });
      }
      res.status(200).json(paciente);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener paciente con NHC ${NHC}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca y devuelve un paciente junto con sus detalles de persona basado en su NHC.
   * El NHC se obtiene de los parámetros de la ruta de la solicitud HTTP.
   * Se hace una llamada al método 'findByNHCWithPersonaDetails' del modelo de paciente para realizar la búsqueda.
   * Si el paciente es encontrado, se devuelve un objeto paciente con una respuesta de estado 200.
   * Si el paciente no es encontrado, se devuelve una respuesta de estado 404 con el mensaje 'Paciente no encontrado'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByNHCWithPersonaDetails(req, res) {
    try {
      const NHC = req.params.NHC;
      const pacienteDetails = await pacienteModel.findByNHCWithPersonaDetails(
        NHC
      );
      if (!pacienteDetails) {
        return res.status(404).json({
          mensaje: `No se encontraron detalles para el paciente con NHC ${NHC}`,
        });
      }
      res.status(200).json(pacienteDetails);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener detalles del paciente con NHC ${NHC}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza la información de un paciente específico por su NHC
   * Los datos a actualizar se reciben en el cuerpo de la solicitud HTTP.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje indicando el éxito.
   * En caso de no encontrar al paciente, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const NHC = req.params.NHC;
    try {
      const updatedData = req.body;
      await personaModel.findById(NHC); // Verifica la existencia de la persona asociada al NHC
      const result = await pacienteModel.updateById(NHC, updatedData);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Paciente con NHC ${NHC} no encontrado` });
      }
      res
        .status(200)
        .json({ mensaje: `Paciente con NHC ${NHC} actualizado exitosamente` });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar paciente con NHC ${NHC}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método elimina un paciente específico por su NHC. El NHC se obtiene de los parámetros
   * de la ruta de la solicitud HTTP.Se hace una llamada al método 'remove' del modelo de paciente para eliminar la persona de la base de datos.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje indicando el éxito.
   * En caso de no encontrar el paciente a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const NHC = req.params.NHC;
    try {
      const result = await pacienteModel.remove(NHC);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Paciente con NHC ${NHC} no encontrado` });
      }
      res
        .status(200)
        .json({ mensaje: `Paciente con NHC ${NHC} eliminado exitosamente` });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar paciente con NHC ${NHC}`,
        error: err.message,
      });
    }
  },
};

module.exports = pacienteController;
