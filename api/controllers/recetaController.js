const recetaModel = require('../models/recetaModel');
const pacienteModel = require('../models/pacienteModel');
const medicamentoModel = require('../models/medicamentoModel');
const usuarioModel = require('../models/usuarioModel');
const personaModel = require('../models/personaModel');

const RecetaController = {
  /**
   * Crea una nueva receta. Valida y recibe los datos desde el cuerpo de la solicitud HTTP.
   * Verifica la existencia de entidades relacionadas antes de crear el registro.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos del registro creado.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */

  async create(req, res) {
    try {
      const {
        nhc_paciente,
        id_medicamento,
        id_medico,
        fecha_receta,
        recomendaciones,
      } = req.body;

      // Verificar la existencia del paciente, medicamento y médico
      const paciente = await pacienteModel.findByNhc(nhc_paciente);
      if (!paciente) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' });
      }

      const medicamento = await medicamentoModel.findById(id_medicamento);
      if (!medicamento) {
        return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
      }

      const medico = await usuarioModel.findById(id_medico);
      if (!medico) {
        return res.status(404).json({ mensaje: 'Médico no encontrado' });
      }

      // Crear la nueva receta
      const nuevaReceta = {
        nhc_paciente,
        id_medicamento,
        id_medico,
        fecha_receta: fecha_receta || new Date(), // Asegúrate de tener una fecha por defecto si no se proporciona
        recomendaciones,
      };

      const recetaCreada = await recetaModel.create(nuevaReceta);
      res.status(201).json(recetaCreada);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al crear la receta',
        error: error.message,
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
      const recetas = await recetaModel.getAll();
      if (recetas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron recetas' });
      }
      res.status(200).json(recetas);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al obtener las recetas',
        error: error.message,
      });
    }
  },

  /**
   * Este método recupera los detalles extendidos de todas las recetas de la base de datos,
   * incluyendo el nombre del medicamento desde la tabla 'medicamento y el nombre del paciente y sus apellidos asi como el nombre del usuario
   * Llama al método 'getAllWithDetails' del modelo de receta, que ejecuta una consulta SQL para obtener
   * tods las recetas con sus detalles extendidos.
   * Si la consulta es exitosa y se encuentran registros, devuelve una respuesta con estado 200 y los datos detallados.
   * En caso de que no se encuentren registros, devuelve una respuesta con estado 404 y un mensaje indicando que no se encontraron registros.
   * En caso de error durante la consulta, captura la excepción, envía una respuesta con estado 500 y detalles del error.
   */
  async getRecetasDetails(req, res) {
    try {
      const recetasConDetalles = await recetaModel.getAllWithDetails();
      if (recetasConDetalles.length === 0) {
        return res
          .status(404)
          .json({ mensaje: 'No se encontraron recetas con detalles' });
      }
      res.status(200).json(recetasConDetalles);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al obtener los detalles de las recetas',
        error: error.message,
      });
    }
  },

  /**
   * Este método obtiene una receta  específico por su ID(idReceta). El idReceta se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos del registro con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar la receta, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const receta = await recetaModel.findById(req.params.idReceta);
    try {
      res.status(200).json(receta);
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: 'Error al obtener la receta', error: error.message });
    }
  },

  /**
   * Busca y devuelve todas las recetas asociadas a un NHC de paciente específico.
   * Extrae el NHC del paciente de los parámetros de la solicitud y llama al método findByNhc del modelo receta.
   * Utiliza async/await para manejar las operaciones asíncronas y try/catch para el manejo de errores.
   * Devuelve una lista de recetas con una respuesta de estado 200 si se encuentran recetas.
   * En caso de no encontrar recetas para el paciente, devuelve un estado 404 con un mensaje apropiado.
   * Captura y maneja cualquier error que ocurra durante la búsqueda, devolviendo un estado 500 y los detalles del error.
   */
  async findByNhc(req, res) {
    const nhc_paciente = req.params.nhc_paciente;
    try {
      const recetas = await recetaModel.findByNhc(nhc_paciente);
      if (recetas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron recetas para el paciente con NHC ${nhc_paciente}`,
        });
      }
      res.status(200).json(recetas);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al buscar recetas por NHC del paciente',
        error: error.message,
      });
    }
  },

  /**
   * Busca y devuelve todas las recetas asociadas a un ID de medicamento específico.
   * Extrae el ID del medicamento de los parámetros de la solicitud y llama al método findByMedicamentoId del modelo receta.
   * Utiliza async/await para manejar las operaciones asíncronas y try/catch para el manejo de errores.
   * Devuelve una lista de recetas con una respuesta de estado 200 si se encuentran recetas.
   * En caso de no encontrar recetas para el medicamento, devuelve un estado 404 con un mensaje apropiado.
   * Captura y maneja cualquier error que ocurra durante la búsqueda, devolviendo un estado 500 y los detalles del error.
   */
  async findByMedicamentoId(req, res) {
    try {
      const idMedicamento = req.params.idMedicamento;
      const recetas = await recetaModel.findByMedicamentoId(idMedicamento);
      if (recetas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron recetas para el medicamento con ID ${idMedicamento}`,
        });
      }
      res.status(200).json(recetas);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al buscar recetas por ID del medicamento',
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza una receta  específico por su ID con los datos proporcionados en el cuerpo de la solicitud HTTP.
   * Verifica primero la existencia del medicamento asociado al inventario.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la receta , devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idReceta = req.params.idReceta;
    const datosActualizados = req.body;

    try {
      // Realizar la actualización de la receta
      const result = await recetaModel.updateById(idReceta, datosActualizados);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Receta con ID ${idReceta} no encontrada`,
        });
      }

      res.status(200).json({
        mensaje: `Receta con ID ${idReceta} actualizada exitosamente`,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al actualizar la receta con ID ${idReceta}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método elimina un registro específico por su ID(idReceta ). El idReceta se obtiene de los parámetros de la solicitud HTTP.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar el registro a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idReceta = req.params.idReceta;
    try {
      const resultado = await recetaModel.removeById(idReceta);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Receta con ID ${idReceta} no encontrada`,
        });
      }
      res.status(200).json({
        mensaje: `Receta con ID ${idReceta} eliminada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar la receta con ID ${idReceta}`,
        error: err.message,
      });
    }
  },
};

module.exports = RecetaController;
