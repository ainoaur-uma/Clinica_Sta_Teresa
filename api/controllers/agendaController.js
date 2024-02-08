const AgendaModel = require('../models/agendaModel');

const agendaController = {
  /**
   * Crea una nueva entrada en la agenda. Valida y recibe los datos desde el cuerpo de la solicitud HTTP.
   * Verifica la existencia del paciente antes de crear la entrada en la agenda.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos de la agenda creada.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevaAgenda = req.body;
      const agendaCreada = await AgendaModel.create(nuevaAgenda);
      res.status(201).json(agendaCreada);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al crear la entrada en la agenda',
        error: err.message,
      });
    }
  },

  /**
   * Recupera todas las entradas de la agenda de la base de datos. No requiere parámetros.
   * Devuelve una lista de entradas de la agenda con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const agendas = await AgendaModel.getAll();
      res.status(200).json(agendas);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener las agendas', error: err.message });
    }
  },

  /**
   * Este método obtiene una entrada de la agenda específica por su ID (idAgenda). El idAgenda se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos de la entrada con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar la entrada en la agenda, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idAgenda = req.params.idAgenda;
    try {
      const agenda = await AgendaModel.findById(idAgenda);
      if (!agenda) {
        return res.status(404).json({
          mensaje: `Entrada en la agenda con ID ${idAgenda} no encontrada`,
        });
      }
      res.status(200).json(agenda);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener la entrada en la agenda con ID ${idAgenda}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca agendas por su descripción. La descripción se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve una lista de agendas que coinciden con la descripción proporcionada con una respuesta de estado 200.
   * En caso de no encontrar agendas con esa descripción, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByDescripcion(req, res) {
    try {
      const descripcion = req.params.descripcion;
      const agendas = await AgendaModel.findByDescripcion(descripcion);
      if (agendas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron agendas con la descripción ${descripcion}`,
        });
      }
      res.status(200).json(agendas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al buscar agendas por descripción`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza una entrada en la agenda específica por su ID (idAgenda) con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la entrada en la agenda, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idAgenda = req.params.idAgenda;
    const updatedData = req.body;
    try {
      const result = await AgendaModel.updateById(idAgenda, updatedData);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Entrada en la agenda con ID ${idAgenda} no encontrada`,
        });
      }
      res.status(200).json({
        mensaje: `Entrada en la agenda con ID ${idAgenda} actualizada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar la entrada en la agenda con ID ${idAgenda}`,
        error: err.message,
      });
    }
  },

  /**
   * Elimina una entrada en la agenda específica por su ID (idAgenda). El idAgenda se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la entrada en la agenda para eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idAgenda = req.params.idAgenda;
    try {
      const result = await AgendaModel.removeById(idAgenda);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Entrada en la agenda con ID ${idAgenda} no encontrada`,
        });
      }
      res.status(200).json({
        mensaje: `Entrada en la agenda con ID ${idAgenda} eliminada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar la entrada en la agenda con ID ${idAgenda}`,
        error: err.message,
      });
    }
  },
};

module.exports = agendaController;
