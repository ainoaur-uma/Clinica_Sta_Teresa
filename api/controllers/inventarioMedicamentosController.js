const InventarioMedicamentosModel = require('../models/inventarioMedicamentosModel');
const medicamentoModel = require('../models/medicamentoModel');

const InventarioMedicamentosController = {
  /**
   * Crea un nuevo registro. Valida y recibe los datos desde el cuerpo de la solicitud HTTP.
   * Verifica la existencia de entidades relacionadas antes de crear el registro.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del registro creado.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const { idMedicamento, cantidad_actual, fecha_registro } = req.body;

      await medicamentoModel.findById(idMedicamento);
      const nuevoRegistroInventario = {
        idMedicamento,
        cantidad_actual,
        fecha_registro,
      };
      const registroCreado = await InventarioMedicamentosModel.create(
        nuevoRegistroInventario
      );
      res.status(201).json(registroCreado);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al crear registro de inventario',
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera todos los registros de la base de datos.Llama al método 'getAll' del pacienteModel,
   * que ejecute una consulta SQL para obtener todos los registros del inventario.
   * Devuelve una lista de pacietes con una respuesta de estado 200.
   * En caso de error, captura la excepción y envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const registros = await InventarioMedicamentosModel.getAll();
      res.status(200).json(registros);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener registros de inventario',
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera los detalles extendidos de todos los registros de inventario de la base de datos,
   * incluyendo el nombre del medicamento desde la tabla 'medicamento'.
   * Llama al método 'getAllWithDetails' del modelo de inventario, que ejecuta una consulta SQL para obtener
   * todos los registros de inventario con sus detalles extendidos.
   * Si la consulta es exitosa y se encuentran registros, devuelve una respuesta con estado 200 y los datos detallados.
   * En caso de que no se encuentren registros, devuelve una respuesta con estado 404 y un mensaje indicando que no se encontraron registros.
   * En caso de error durante la consulta, captura la excepción, envía una respuesta con estado 500 y detalles del error.
   */
  async getInventarioDetails(req, res) {
    try {
      const inventarioConDetalles =
        await InventarioMedicamentosModel.getAllWithDetails();
      if (inventarioConDetalles.length === 0) {
        return res
          .status(404)
          .json({ mensaje: 'No se encontraron registros en el inventario' });
      }
      res.status(200).json(inventarioConDetalles);
    } catch (err) {
      res.status(500).json({
        message:
          'Error al obtener los detalles de todos los registros del inventario',
        error: err.message,
      });
    }
  },

  /**
   * Este método obtiene un registro específico por su ID(idInventario). El idInventario se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del registro con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar el registro, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idInventario = req.params.idInventario;
    try {
      const inventario = await InventarioMedicamentosModel.findById(
        idInventario
      );
      if (!inventario) {
        return res.status(404).json({
          mensaje: `Registro de inventario con ID ${idInventario} no encontrado`,
        });
      }
      res.status(200).json(inventario);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener el registro de inventario con ID ${idInventario}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca y devuelve registros de inventario basados en el ID del medicamento.
   * El ID del medicamento se obtiene de los parámetros de la ruta de la solicitud HTTP.
   * Se hace una llamada al método 'findByMedicamentoId' del modelo de inventario de medicamentos para realizar la búsqueda.
   * Si se encuentran registros, se devuelve una lista de registros de inventario con una respuesta de estado 200.
   * Si no se encuentran registros para el medicamento, se devuelve una respuesta de estado 404 con el mensaje 'Registros no encontrados'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByMedicamentoId(req, res) {
    const idMedicamento = req.params.idMedicamento;
    try {
      const registros = await InventarioMedicamentosModel.findByMedicamentoId(
        idMedicamento
      );
      if (registros.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron registros para el medicamento con ID ${idMedicamento}`,
        });
      }
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al buscar registros de inventario por el ID del medicamento ${idMedicamento}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza un registro de inventario específico por su ID con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Verifica primero la existencia del medicamento asociado al inventario.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el registro de inventario, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idInventario = req.params.idInventario; // Asegúrate de que este parámetro coincida con cómo lo has definido en tus rutas.
    const datosActualizados = req.body;

    try {
      const result = await InventarioMedicamentosModel.updateById(
        idInventario,
        datosActualizados
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Registro de inventario con ID ${idInventario} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Registro de inventario con ID ${idInventario} actualizado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar el registro de inventario con ID ${idInventario}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método elimina un registro específico por su ID(idInventario). El idInventario se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el registro a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idInventario = req.params.idInventario;
    try {
      const resultado = await InventarioMedicamentosModel.removeById(
        idInventario
      );
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Registro de inventario con ID ${idInventario} no encontrado`,
        });
      }
      res.status(200).json({
        mensaje: `Registro de inventario con ID ${idInventario} eliminado exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar el registro de inventario con ID ${idInventario}`,
        error: err.message,
      });
    }
  },
};

module.exports = InventarioMedicamentosController;
