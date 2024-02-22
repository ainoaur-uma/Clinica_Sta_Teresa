const CitaModel = require('../models/citaModel');
const PacienteModel = require('../models/pacienteModel');
const UsuarioModel = require('../models/usuarioModel');
const AgendaModel = require('../models/agendaModel');

const citaController = {
  /**
   * Crea una nueva cita en la base de datos. Valida y recibe los datos desde el cuerpo de la solicitud HTTP.
   * Realiza verificaciones para asegurarse de que el paciente, el usuario (doctor) y la agenda existan.
   * Si la creación es exitosa, devuelve una respuesta con estado 201 y los datos de la cita creada.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevaCita = req.body;
      await PacienteModel.findByNhc(nuevaCita.NHC_paciente);
      await UsuarioModel.findById(nuevaCita.doctor_id);
      await AgendaModel.findById(nuevaCita.agenda_id);

      const citaCreada = await CitaModel.create(nuevaCita);
      res.status(201).json(citaCreada);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al crear la cita',
        error: err.message,
      });
    }
  },

  /**
   * Recupera todas las citas de la base de datos. No requiere parámetros.
   * Devuelve una lista de citas con una respuesta de estado 200.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const citas = await CitaModel.getAll();
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener las citas',
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera todos los detalles de las citas de la base de datos,
   * incluyendo información adicional de las tablas 'persona', 'usuario', y 'agenda'.
   * Llama al método 'getAllWithDetails' del modelo de citas, que ejecuta una consulta SQL
   * para obtener todos los registros de citas con sus detalles extendidos de las tablas relacionadas.
   * Si la consulta es exitosa y se encuentran citas, devuelve una respuesta con estado 200 y los datos detallados.
   * En caso de que no se encuentren citas, devuelve una respuesta con estado 404 y un mensaje indicando que no se encontraron citas.
   * En caso de error durante la consulta, captura la excepción, envía una respuesta con estado 500 y detalles del error.
   */
  async getCitasDetails(req, res) {
    try {
      const citasConDetalles = await CitaModel.getAllWithDetails();
      if (citasConDetalles.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron citas' });
      }
      res.status(200).json(citasConDetalles);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener los detalles de las citas',
        error: err.message,
      });
    }
  },

  /**
   * Obtiene una cita específica por su ID (idCita). El ID se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los detalles de la cita con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar la cita, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idCita = req.params.idCita;
    try {
      const cita = await CitaModel.findById(idCita);
      if (!cita) {
        return res.status(404).json({
          mensaje: `Cita con ID ${idCita} no encontrada`,
        });
      }
      res.status(200).json(cita);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener la cita con ID ${idCita}`,
        error: err.message,
      });
    }
  },

  /**
   * Busca citas dentro de un rango de fechas especificado por los parámetros de consulta 'fechaInicio' y 'fechaFin'.
   * Si no se especifican fechas, busca todas las citas para la semana actual.
   * Devuelve un arreglo con las citas encontradas con una respuesta de estado 200.
   * En caso de no encontrar citas dentro del rango especificado, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findCitasByDateRangeOrCurrentWeek(req, res) {
    const { fechaInicio, fechaFin } = req.query;
    try {
      const citas = await CitaModel.findCitasByDateRangeOrCurrentWeek(
        fechaInicio,
        fechaFin
      );
      if (citas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron citas en el rango de fechas especificado${
            fechaInicio && fechaFin
              ? ` desde ${fechaInicio} hasta ${fechaFin}`
              : ' para la semana actual'
          }.`,
        });
      }
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al buscar citas${
          fechaInicio && fechaFin
            ? ` en el rango de fechas desde ${fechaInicio} hasta ${fechaFin}`
            : ' para la semana actual'
        }`,
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera todas las citas de la semana actual junto con detalles extendidos
   * de las tablas 'persona', 'usuario' y 'agenda'.
   * Llama al método 'getCitasWithDetailsForCurrentWeek' del modelo de citas, que ejecuta
   * una consulta SQL para obtener todas las citas con detalles para la semana actual.
   * Si la consulta es exitosa y se encuentran citas, devuelve una respuesta con estado 200
   * y los datos detallados.
   * En caso de que no se encuentren citas, devuelve una respuesta con estado 404 y un mensaje
   * indicando que no se encontraron citas para la semana actual.
   * En caso de error durante la consulta, captura la excepción y envía una respuesta con estado 500
   * y detalles del error.
   */
  async getCitasWithDetailsForCurrentWeek(req, res) {
    try {
      const citasConDetalles =
        await CitaModel.getCitasWithDetailsForCurrentWeek();
      if (citasConDetalles.length === 0) {
        return res
          .status(404)
          .json({ mensaje: 'No se encontraron citas para la semana actual.' });
      }
      res.status(200).json(citasConDetalles);
    } catch (err) {
      res.status(500).json({
        mensaje:
          'Error al obtener las citas con detalles para la semana actual.',
        error: err.message,
      });
    }
  },

  /**
   * Busca todas las citas de un paciente específico por su NHC. Valida que el NHC sea un número entero válido.
   * Si se encuentran citas, devuelve un arreglo con estas con una respuesta de estado 200.
   * En caso de no encontrar citas para el paciente, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByNhc(req, res) {
    const NHC_paciente = req.params.NHC_paciente;
    try {
      const citas = await CitaModel.findByNhc(NHC_paciente);
      if (citas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron citas para el paciente con NHC ${NHC_paciente}`,
        });
      }
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al buscar citas por NHC del paciente ${NHC_paciente}`,
        error: err.message,
      });
    }
  },

  /**
   * Busca todas las citas asociadas a un usuario específico, identificado por su ID de usuario (doctor). Valida que el ID sea un número entero válido.
   * Devuelve un arreglo con las citas asociadas a ese usuario con una respuesta de estado 200.
   * En caso de no encontrar citas, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByUsuarioId(req, res) {
    const doctor_id = req.params.doctor_id;
    try {
      const citas = await CitaModel.findByUsuarioId(doctor_id);
      if (citas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron citas para el doctor con ID ${doctor_id}`,
        });
      }
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al buscar citas por ID del doctor ${doctor_id}`,
        error: err.message,
      });
    }
  },

  /**
   * Obtiene todas las citas asociadas a una agenda específica mediante el ID de la agenda. Valida que el ID de la agenda sea un número entero válido.
   * Devuelve un arreglo con las citas encontradas con una respuesta de estado 200.
   * En caso de no encontrar citas para la agenda, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByAgendaId(req, res) {
    const agenda_id = req.params.agenda_id;
    try {
      const citas = await CitaModel.findByAgendaId(agenda_id);
      if (citas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron citas para la agenda con ID ${agenda_id}`,
        });
      }
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al buscar citas por ID de la agenda ${agenda_id}`,
        error: err.message,
      });
    }
  },

  /**
   * Busca citas basándose en el nombre de la agenda. Realiza una búsqueda por coincidencia de texto en los nombres de las agendas y devuelve todas las citas que pertenecen a agendas con nombres coincidentes con el criterio de búsqueda proporcionado.
   * En caso de no encontrar coincidencias, devuelve un estado 404.
   * En caso de error durante la búsqueda, envía una respuesta con estado 500 y los detalles del error.
   */
  async findByNombreAgenda(req, res) {
    const nombreAgenda = req.params.nombreAgenda;
    try {
      const citas = await CitaModel.findByNombreAgenda(nombreAgenda);
      if (citas.length === 0) {
        return res.status(404).json({
          mensaje: `No se encontraron citas con el nombre de agenda '${nombreAgenda}'`,
        });
      }
      res.status(200).json(citas);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al buscar citas por nombre de la agenda '${nombreAgenda}'`,
        error: err.message,
      });
    }
  },

  /**
   * Actualiza los detalles de una cita específica identificada por su ID, con los datos proporcionados en el cuerpo de la solicitud HTTP. Valida los datos y verifica que la cita exista.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la cita, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idCita = req.params.idCita;
    const updatedData = req.body;
    try {
      const result = await CitaModel.updateById(idCita, updatedData);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Cita con ID ${idCita} no encontrada o sin cambios necesarios`,
        });
      }
      res.status(200).json({
        mensaje: `Cita con ID ${idCita} actualizada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar la cita con ID ${idCita}`,
        error: err.message,
      });
    }
  },

  /**
   * Elimina una cita específica de la base de datos utilizando su ID. Valida que el ID proporcionado sea un número entero válido.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje de éxito.
   * En caso de no encontrar la cita para eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idCita = req.params.idCita;
    try {
      const result = await CitaModel.removeById(idCita);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensaje: `Cita con ID ${idCita} no encontrada`,
        });
      }
      res.status(200).json({
        mensaje: `Cita con ID ${idCita} eliminada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar la cita con ID ${idCita}`,
        error: err.message,
      });
    }
  },
};

module.exports = citaController;
