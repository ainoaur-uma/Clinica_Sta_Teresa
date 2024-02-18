const hceModel = require('../models/hceModel');
const pacienteModel = require('../models/pacienteModel');

const hceController = {
  /**
   * Crea una nueva Historia Clínica Electrónica (HCE) para un paciente.
   * Antes de crear la HCE, verifica la existencia del paciente mediante su NHC.
   * Si la validación es exitosa y el paciente existe, procede a crear la HCE.
   * Devuelve una respuesta con estado 201 y los datos de la HCE creada.
   * En caso de error, como la inexistencia del paciente o fallos en la inserción, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevaHCE = req.body;
      await pacienteModel.findByNhc(nuevaHCE.NHC_paciente);
      const hceCreada = await hceModel.create(nuevaHCE);
      res.status(201).json(hceCreada);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear la HCE', error: err.message });
    }
  },

  /**
   * Este método recupera todas las HCEs de la base de datos. Llama al método 'getAll' del modelo de HCEs,
   * que ejecuta una consulta SQL para obtener todos los registros de HCEs.
   * Devuelve una lista de HCEs con una respuesta de estado 200.
   * En caso de error, captura la excepción y envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const hces = await hceModel.getAll();
      res.status(200).json(hces);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener todas las HCEs',
        error: err.message,
      });
    }
  },

  /**
   * Este método obtiene la Historia Clínica Electrónica (HCE) de un paciente específico por su NHC.
   * El NHC se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los detalles de la HCE con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar la HCE para el paciente, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByNHCWithDetails(req, res) {
    const NHC_paciente = req.params.NHC_paciente; // Obtener el NHC del paciente desde los parámetros de la ruta
    try {
      // Llamada al nuevo método del modelo que incluye los detalles extendidos
      const hceConDetalles = await hceModel.getByNHCWithDetails(NHC_paciente);
      if (!hceConDetalles || hceConDetalles.length === 0) {
        // Si no se encuentra la HCE, devolver un estado 404 con un mensaje
        return res.status(404).json({
          mensaje: `No se encontró la HCE con detalles para el paciente con NHC ${NHC_paciente}`,
        });
      }
      // Si se encuentra la HCE, devolver un estado 200 con los datos de la HCE
      res.status(200).json(hceConDetalles);
    } catch (err) {
      // En caso de error durante la consulta, capturar la excepción y enviar una respuesta adecuada
      res.status(500).json({
        mensaje: `Error al obtener la HCE con detalles para el paciente con NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera los detalles extendidos de la Historia Clínica Electrónica (HCE) de un paciente específico de la base de datos,
   * incluyendo información personal desde la tabla 'persona'.
   * Llama al método 'getByNHCWithDetails' del modelo HCE, que ejecuta una consulta SQL para obtener un registro de HCE con sus detalles extendidos.
   * El método valida primero el 'NHC_paciente' para asegurarse de que es un entero válido.
   * Si la consulta es exitosa y la HCE existe, devuelve una respuesta con estado 200 y los datos detallados de la HCE.
   * Si la HCE no existe, devuelve una respuesta con estado 404 y un mensaje indicando que la HCE no fue encontrada.
   * En caso de error durante la consulta, captura la excepción, envía una respuesta con estado 500 y detalles del error.
   */
  async getHceDetails(req, res) {
    const NHC_paciente = req.params.NHC_paciente; // Captura el NHC_paciente de los parámetros
    try {
      const hceConDetalles = await hceModel.getByNHCWithDetails(NHC_paciente); // Pasa el NHC_paciente a la función
      if (!hceConDetalles) {
        return res.status(404).json({
          mensaje: `HCE del paciente con NHC ${NHC_paciente} no encontrada`,
        });
      }
      res.status(200).json(hceConDetalles);
    } catch (err) {
      res.status(500).json({
        message: `Error al obtener los detalles de la HCE del paciente con NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /** Este método actualiza la Historia Clínica Electrónica (HCE) de un paciente específico por su NHC con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Verifica primero la existencia del paciente asociado a la HCE.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la HCE, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateByNHC(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    const datosActualizados = req.body;

    try {
      await pacienteModel.findByNhc(NHC_paciente);

      const resultado = await hceModel.updateByNHC(
        NHC_paciente,
        datosActualizados
      );
      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `HCE con NHC ${NHC_paciente} no encontrada` });
      }
      res.status(200).json({
        mensaje: `HCE con NHC ${NHC_paciente} actualizada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar la HCE con NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método elimina una HCE específica por el NHC del paciente.
   * El NHC se obtiene de los parámetros de la ruta de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje indicando el éxito.
   * En caso de no encontrar la HCE a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteByNHC(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    try {
      const resultado = await hceModel.removeByNHC(NHC_paciente);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `HCE del paciente con  NHC ${NHC_paciente} no encontrada`,
        });
      }
      res.status(200).json({
        mensaje: `HCE con NHC ${NHC_paciente} eliminada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar la HCE del  NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },
};

module.exports = hceController;
