const episodioModel = require('../models/episodioModel');
const pacienteModel = require('../models/pacienteModel');

const episodioController = {
  /**
   * Crea un nuevo episodio. Valida y recibe los datos del episodio desde el cuerpo de la solicitud HTTP.
   * Verifica la existencia del paciente antes de crear el episodio.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del episodio creado.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevoEpisodio = req.body;
      await pacienteModel.findByNhc(nuevoEpisodio.NHC_paciente);
      const episodioCreado = await episodioModel.create(nuevoEpisodio);
      res.status(201).json(episodioCreado);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear el episodio', error: err.message });
    }
  },

  /**
   * Recupera todos los episodios de la base de datos. No requiere parámetros.
   * Devuelve una lista de episodios con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const episodios = await episodioModel.getAll();
      res.status(200).json(episodios);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener episodios', error: err.message });
    }
  },

  /**
   * Este método obtiene un episodio específico por su ID (idEpisodio). El idEpisodio se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del episodio con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar el episodio, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idEpisodio = req.params.idEpisodio;
    try {
      const episodio = await episodioModel.findById(idEpisodio);
      if (!episodio) {
        return res
          .status(404)
          .json({ mensaje: `Episodio con ID ${idEpisodio} no encontrado` });
      }
      res.status(200).json(episodio);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener el episodio con ID ${idEpisodio}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método obtiene todos los episodios de un paciente específico por su NHC.
   * El NHC se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve una lista de episodios con una respuesta de estado 200 si se encuentran.
   * En caso de no encontrar episodios para el paciente, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByNHC(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    try {
      const episodios = await episodioModel.findByNHC(NHC_paciente);
      if (episodios.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron episodios para el paciente con NHC ${NHC_paciente}`,
        });
      }
      res.status(200).json(episodios);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener episodios para el paciente con NHC ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método actualiza un episodio específico por su ID con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Verifica primero la existencia del paciente asociados al episodio.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el episodio, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idEpisodio = req.params.idEpisodio;
    const updatedData = req.body;
    try {
      const result = await episodioModel.updateById(idEpisodio, updatedData);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Episodio con ID ${idEpisodio} no encontrado` });
      }
      res.status(200).json({
        mensaje: `Episodio con ID ${idEpisodio} actualizado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar el episodio con ID ${idEpisodio}`,
        error: err.message,
      });
    }
  },

  /**
   * Elimina un episodio específico por su ID (idEpisodio). El idEpisodio se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el episodio a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idEpisodio = req.params.idEpisodio;
    try {
      const result = await episodioModel.removeById(idEpisodio);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Episodio con ID ${idEpisodio} no encontrado` });
      }
      res.status(200).json({
        mensaje: `Episodio con ID ${idEpisodio} eliminado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar el episodio con ID ${idEpisodio}`,
        error: err.message,
      });
    }
  },
};

module.exports = episodioController;
