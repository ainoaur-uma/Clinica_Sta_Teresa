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
   * Este método crea un nuevo registro de persona y paciente de manera atómica.
   * Recibe los datos de la persona y del paciente desde el cuerpo de la solicitud HTTP, los valida y luego los inserta en las tablas correspondientes.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del nuevo paciente y persona creados.
   * En caso de error, captura la excepción y envía una respuesta con estado 500 y los detalles del error.
   */
  async createPersonaAndPatient(req, res) {
    const { datosPersona, datosPaciente } = req.body;

    try {
      // Intenta crear la persona y el paciente utilizando el método del modelo
      const resultado = await pacienteModel.createPacientePersona(
        datosPersona,
        datosPaciente
      );
      res.status(201).json({
        mensaje: 'Persona y paciente creados con éxito',
        idPersona: resultado.idPersona,
        NHC: resultado.NHC,
      });
    } catch (err) {
      // Si ocurre un error, responde con código 500 y el mensaje de error
      res.status(500).json({
        mensaje: 'Error al crear la persona y el paciente',
        error: err.message,
      });
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
   * Este método recupera los detalles extendidos de todos los pacientes de la base de datos,
   * incluyendo los datos personales desde la tabla 'persona'.
   * Llama al método 'getAllWithDetails' del modelo de pacientes, que ejecuta una consulta SQL
   * para obtener todos los registros de pacientes con sus detalles extendidos de la tabla 'persona'.
   * Si la consulta es exitosa y se encuentran pacientes, devuelve una respuesta con estado 200 y los datos detallados.
   * En caso de que no se encuentren pacientes, devuelve una respuesta con estado 404 y un mensaje indicando que no se encontraron pacientes.
   * En caso de error durante la consulta, captura la excepción, envía una respuesta con estado 500 y detalles del error.
   */
  async getPatientDetails(req, res) {
    try {
      const pacientesConDetalles = await pacienteModel.getAllWithDetails();
      if (pacientesConDetalles.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron pacientes' });
      }
      res.status(200).json(pacientesConDetalles);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener los detalles de los pacientes',
        error: err.message,
      });
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
   * Actualiza tanto los datos personales asociados a un paciente (a través de la tabla persona) como los datos específicos del paciente.
   * Los datos se reciben en el cuerpo de la solicitud HTTP, divididos en dos partes: datosPersona y datosPaciente.
   * Utiliza una transacción para asegurar la integridad de la actualización.
   * En caso de éxito, envía una respuesta confirmando la actualización.
   * Si el paciente o la persona asociada no se encuentran, devuelve un estado 404.
   * Cualquier error en el proceso resulta en una respuesta de estado 500 con detalles del error.
   */
  async updatePersonaYPaciente(req, res) {
    const idPersona = req.params.NHC; // Asume que el NHC se pasa como parámetro de ruta
    const { datosPersona, datosPaciente } = req.body; // Desestructura los datos recibidos en el cuerpo de la solicitud

    try {
      // Llamada al método del modelo para actualizar la persona y el paciente de manera atómica
      await pacienteModel.updatePersonaYPacienteConTransaccion(
        idPersona,
        datosPersona,
        datosPaciente
      );
      res.json({
        mensaje: `Los datos del paciente con NHC ${idPersona} y los datos personales asociados han sido actualizados exitosamente.`,
      });
    } catch (error) {
      if (
        error.message.includes('Persona no encontrada') ||
        error.message.includes('Paciente no encontrado')
      ) {
        return res.status(404).json({ mensaje: error.message });
      }
      res.status(500).json({
        mensaje: `Error al actualizar los datos del paciente con NHC ${idPersona} y los datos personales asociados.`,
        error: error.message,
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
