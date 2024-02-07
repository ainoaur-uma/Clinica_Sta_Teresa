const medicamentoModel = require('../models/medicamentoModel');

const medicamentoController = {
  /**
   * Crea un nuevo medicamento. Valida y recibe los datos del medicamento desde el cuerpo de la solicitud HTTP.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del medicamento creado.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevoMedicamento = req.body;
      const medicamentoCreado = await medicamentoModel.create(nuevoMedicamento);
      res.status(201).json(medicamentoCreado);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear el medicamento', error: err.message });
    }
  },

  /**
   * Recupera todos los medicamentos de la base de datos. No requiere parámetros.
   * Devuelve una lista de medicamentos con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const medicamentos = await medicamentoModel.getAll();
      res.status(200).json(medicamentos);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener medicamentos', error: err.message });
    }
  },

  /**
   * Este método obtiene un medicamento específico por su ID. El ID se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del medicamento con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar el medicamento, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idMedicamento = req.params.medicamentoId;
    try {
      const medicamento = await medicamentoModel.findById(idMedicamento);
      if (!medicamento) {
        return res.status(404).json({
          mensaje: `Medicamento con ID ${idMedicamento} no encontrado`,
        });
      }
      res.status(200).json(medicamento);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener el medicamento con ID ${idMedicamento}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca y devuelve medicamentos basados en su nombre. El nombre se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByNombre' del modelo de medicamento para realizar la búsqueda.
   * Si se encuentran medicamentos, se devuelve un arreglo de objetos medicamento con una respuesta de estado 200.
   * Si no se encuentran medicamentos con ese nombre, se devuelve una respuesta de estado 404 con el mensaje 'Medicamento no encontrado'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByNombre(req, res) {
    try {
      const nombreMedicamento = req.params.nombreMedicamento;
      const medicamentos = await medicamentoModel.findByNombre(
        nombreMedicamento
      );
      if (medicamentos.length === 0) {
        return res.status(404).json({
          mensaje: `Medicamentos con nombre ${nombreMedicamento} no encontrados`,
        });
      }
      res.status(200).json(medicamentos);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al buscar medicamentos por nombre ${nombreMedicamento}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método busca medicamentos por su principio activo. El principio activo se obtiene de los parámetros de la ruta de la solicitud HTTP.
   * Devuelve una lista de medicamentos que coinciden con el principio activo proporcionado con una respuesta de estado 200.
   * En caso de no encontrar medicamentos con ese principio activo, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByPrincipioActivo(req, res) {
    try {
      const principioActivo = req.params.principioActivo;
      const medicamentos = await medicamentoModel.findByPrincipioActivo(
        principioActivo
      );
      if (medicamentos.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron medicamentos con el principio activo ${principioActivo}`,
        });
      }
      res.status(200).json(medicamentos);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al buscar medicamentos por principio activo ${principioActivo}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza un medicamento específico por su ID(idMedicamento) con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el medicamento, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idMedicamento = req.params.idMedicamento;
    const updatedData = req.body;
    try {
      const result = await medicamentoModel.updateById(
        idMedicamento,
        updatedData
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Medicamento con ID ${idMedicamento} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Medicamento con ID ${idMedicamento} actualizado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar el medicamento con ID ${idMedicamento}`,
        error: err.message,
      });
    }
  },

  /**
   * Elimina un medicamento específico por su ID(idMedicamtno). El idMedicamento se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el medicamento a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idMedicamento = req.params.idMedicamento;
    try {
      const result = await medicamentoModel.removeById(idMedicamento);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Medicamento con ID ${idMedicamento} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Medicamento con ID ${idMedicamento} eliminado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar el medicamento con ID ${idMedicamento}`,
        error: err.message,
      });
    }
  },
};

module.exports = medicamentoController;
