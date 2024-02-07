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
  async findByNHC(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    try {
      const hce = await hceModel.findByNHC(NHC_paciente);
      if (!hce) {
        return res.status(404).json({
          mensaje: `No se encontró la HCE para el paciente con NHC ${NHC_paciente}`,
        });
      }
      res.status(200).json(hce);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener la HCE para el paciente con NHC ${NHC_paciente}`,
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
      res
        .status(200)
        .json({
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
