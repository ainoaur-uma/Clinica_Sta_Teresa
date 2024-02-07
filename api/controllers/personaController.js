const personaModel = require('../models/personaModel');

const personaController = {
  /**
   * Este método crea una nueva persona. Recibe los datos de la persona desde el cuerpo de la solicitud HTTP y los valida.
   * Si los datos son válidos, llama al modelo de persona para insertar la nueva persona en la base de datos.
   * Devuelve una respuesta con estado 201 y los datos de la persona creada si es exitoso.
   * En caso de error, envía una respuesta con estado 500 y los detalles del error.
   */
  async create(req, res) {
    try {
      const nuevaPersona = req.body;
      const personaCreada = await personaModel.create(nuevaPersona);
      res.status(201).json(personaCreada);
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: 'Error al crear la persona', error: err.message });
    }
  },

  /**
   * Este método recupera todos las personas de la base de datos.Llama al método 'getAll' del modelo de personas,
   * que ejecuta una consulta SQL para obtener todos los registros de personas.
   * Devuelve una lista de personas con una respuesta de estado 200.
   * En caso de error, captura la excepción y envía una respuesta con estado 500 y los detalles del error.
   */
  async findAll(req, res) {
    try {
      const personas = await personaModel.getAll();
      res.status(200).json(personas);
    } catch (err) {
      res.status(500).json({
        mensaje: 'Error al obtener todas las  personas',
        error: err.message,
      });
    }
  },

  /**
   * Este método obtiene una persona específica por su ID (idPersona)
   * El idUsuario se obtiene de los parámetros de la solicitud HTTP.
   * Devuelve los datos de la persona con una respuesta de estado 200 si se encuentra.
   * En caso de no encontrar la persona, devuelve un estado 404.
   * En caso de error en la consulta, envía una respuesta con estado 500 y los detalles del error.
   */
  async findOne(req, res) {
    const idPersona = req.params.personaId;
    try {
      const persona = await personaModel.findById(idPersona);
      if (!persona) {
        return res
          .status(404)
          .json({ mensaje: `Persona con id ${idPersona} no encontrada` });
      }
      res.status(200).json(persona);
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al obtener la persona con ID ${idPersona}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método busca y devuelve una persona basada en su carnet de identidad. El carnet de identidad se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByCarnet' del modelo de persona para realizar la búsqueda.
   * Si la persona es encontrada, se devuelve un objeto persona con una respuesta de estado 200.
   * Si la persona no es encontrada, se devuelve una respuesta de estado 404 con el mensaje 'Persona no encontrada'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByCarnet(req, res) {
    try {
      const carnet_identidad = req.params.carnetIdentidad;
      const persona = await personaModel.findByCarnet(carnet_identidad);
      if (!persona) {
        return res.status(404).json({
          mensaje: `Persona con carnet de identidad ${carnet_identidad} no encontrada`,
        });
      }
      res.status(200).json(persona);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener persona con carnet de identidad ${carnet_identidad}`,
        error: error.message,
      });
    }
  },
  /**
   * Este método busca y devuelve personas basadas en su nombre. El nombre se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByNombre' del modelo de persona para realizar la búsqueda.
   * Si se encuentran personas, se devuelve un arreglo de objetos persona con una respuesta de estado 200.
   * Si no se encuentran personas con ese nombre, se devuelve una respuesta de estado 404 con el mensaje 'Persona no encontrada'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByNombre(req, res) {
    try {
      const nombre = req.params.nombre;
      const personas = await personaModel.findByNombre(nombre);
      if (personas.length === 0) {
        return res.status(404).json({
          mensaje: `Personas con nombre ${nombre} no encontradas`,
        });
      }
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener personas con nombre ${nombre}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método busca y devuelve personas basadas en su primer apellido. El primer apellido se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByApellido1' del modelo de persona para realizar la búsqueda.
   * Si se encuentran personas, se devuelve un arreglo de objetos persona con una respuesta de estado 200.
   * Si no se encuentran personas con ese primer apellido, se devuelve una respuesta de estado 404 con el mensaje 'Personas no encontradas'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByApellido1(req, res) {
    try {
      const apellido1 = req.params.apellido1;
      const personas = await personaModel.findByApellido1(apellido1);
      if (personas.length === 0) {
        return res.status(404).json({
          mensaje: `Personas con el primer apellido ${apellido1} no encontradas`,
        });
      }
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener personas con el primer apellido ${apellido1}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método busca y devuelve personas basadas en su segundo apellido. El segundo apellido se obtiene de los parámetros
   * de la ruta de la solicitud HTTP. Se hace una llamada al método 'findByApellido2' del modelo de persona para realizar la búsqueda.
   * Si se encuentran personas, se devuelve un arreglo de objetos persona con una respuesta de estado 200.
   * Si no se encuentran personas con ese segundo apellido, se devuelve una respuesta de estado 404 con el mensaje 'Personas no encontradas'.
   * En caso de un error durante la búsqueda, se devuelve una respuesta de estado 500 con los detalles del error.
   */
  async findByApellido2(req, res) {
    try {
      const apellido2 = req.params.apellido2;
      const personas = await personaModel.findByApellido2(apellido2);
      if (personas.length === 0) {
        return res.status(404).json({
          mensaje: `Personas con el segundo apellido ${apellido2} no encontradas`,
        });
      }
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener personas con el segundo apellido ${apellido2}`,
        error: error.message,
      });
    }
  },

  /**
   * Este método actualiza la información de una persona específica por su ID (idPersona)
   * Los datos a actualizar se reciben en el cuerpo de la solicitud HTTP.
   * Si la actualización es exitosa, devuelve una respuesta con estado 200 y un mensaje indicando el éxito.
   * En caso de no encontrar la persona, devuelve un estado 404.
   * En caso de error durante la actualización, envía una respuesta con estado 500 y los detalles del error.
   */
  async updateById(req, res) {
    const idPersona = req.params.personaId;
    try {
      const datosActualizados = req.body;
      const result = await personaModel.updateById(
        idPersona,
        datosActualizados
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Persona con ID ${idPersona} no encontrada` });
      }
      res.status(200).json({
        mensaje: `Persona con ID ${idPersona} actualizada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al actualizar la persona con ID ${idPersona}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método elimina una persona específica por su ID (idPersona). El ID de la persona se obtiene de los parámetros
   * de la ruta de la solicitud HTTP.Se hace una llamada al método 'removeById' del modelo de persona para eliminar la persona de la base de datos.
   * Si la eliminación es exitosa, devuelve una respuesta con estado 200 y un mensaje indicando el éxito.
   * En caso de no encontrar la persona a eliminar, devuelve un estado 404.
   * En caso de error durante la eliminación, envía una respuesta con estado 500 y los detalles del error.
   */
  async deleteById(req, res) {
    const idPersona = req.params.personaId;
    try {
      const result = await personaModel.removeById(personaId);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: `Persona con ID ${personaId} no encontrada` });
      }
      res.status(200).json({
        mensaje: `Persona con ID ${personaId} eliminada exitosamente`,
      });
    } catch (err) {
      res.status(500).json({
        mensaje: `Error al eliminar la persona con ID ${personaId}`,
        error: err.message,
      });
    }
  },

  /**
   * Este método recupera todas las personas de la base de datos y las devuelve ordenadas alfabéticamente por su nombre.
   * Realiza una llamada al método 'getAllSortedByName' del modelo de persona para llevar a cabo la consulta. Si la consulta
   * es exitosa, devuelve una lista de personas con una respuesta de estado 200. En caso de que ocurra un error durante
   * la consulta, devuelve una respuesta de estado 500 con los detalles del error.
   */
  async getAllSortedByName(req, res) {
    try {
      const personas = await personaModel.getAllSortedByName();
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener personas ordenadas por nombre`,
        error: error.message,
      });
    }
  },

  /**
   * Este método recupera todas las personas de la base de datos y las devuelve ordenadas alfabéticamente
   * por su primer apellido y luego por su segundo apellido. Se hace una llamada al método 'getAllSortedByApellidos'
   * del modelo de persona para realizar la consulta. Si la consulta es exitosa, se devuelve una lista de personas
   * con una respuesta de estado 200. En caso de un error durante la consulta, se devuelve una respuesta de estado 500
   * con los detalles del error.
   */
  async getAllSortedByApellidos(req, res) {
    try {
      const personas = await personaModel.getAllSortedByApellidos();
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({
        mensaje: `Error al obtener personas ordenadas por apellidos`,
        error: error.message,
      });
    }
  },
};

module.exports = personaController;
