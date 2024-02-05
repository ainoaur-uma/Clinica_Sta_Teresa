// Importar los modelos
const datosAntroModel = require('../models/datosAntroModel');
const pacienteModel = require('../models/pacienteModel');

// Validar los datos antropométricos
const validarDatosAntro = (datos, isUpdating = false) => {
  const errores = [];

  // Validaciones para la creación (POST)
  if (!isUpdating) {
    if (!datos.NHC_paciente) {
      errores.push('El NHC del paciente es requerido.');
    }
    // Agregar aquí más validaciones según sea necesario
  } else {
    // Validaciones para la actualización (PATCH)
  }

  return errores;
};

// Crear un nuevo registro de datos antropométricos
exports.create = (req, res) => {
  const nuevoDato = req.body;

  const errores = validarDatosAntro(nuevoDato);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  datosAntroModel.create(nuevoDato, (err, dato) => {
    if (err) {
      console.error('Error al crear registro de datos antropométricos:', err);
      return res.status(500).json({
        mensaje: 'Error al crear registro de datos antropométricos',
        error: err.sqlMessage,
      });
    }
    res.status(201).json(dato);
  });
};

// Obtener todos los registros de datos antropométricos
exports.findAll = (req, res) => {
  datosAntroModel.getAll((err, datos) => {
    if (err) {
      console.error(
        'Error al obtener registros de datos antropométricos:',
        err
      );
      return res.status(500).json({
        mensaje: 'Error al obtener registros de datos antropométricos',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(datos);
  });
};

// Obtener un registro de datos antropométricos por su ID
exports.findOne = (req, res) => {
  const idDatoAntropometrico = req.params.idDatoAntropometrico;

  datosAntroModel.findById(idDatoAntropometrico, (err, dato) => {
    if (err) {
      console.error('Error al obtener registro de datos antropométricos:', err);
      return res.status(500).json({
        mensaje: `Error al obtener registro de datos antropométricos con ID ${idDatoAntropometrico}`,
        error: err.sqlMessage,
      });
    }
    if (!dato) {
      return res
        .status(404)
        .json({ mensaje: 'Registro de datos antropométricos no encontrado' });
    }
    res.status(200).json(dato);
  });
};

// Obtener todos los registros antropométricos de un paciente por su NHC
exports.findByPacienteNHC = (req, res) => {
  const NHC_paciente = req.params.NHC_paciente;

  datosAntroModel.findByPacienteNHC(NHC_paciente, (err, datos) => {
    if (err) {
      console.error(
        'Error al obtener registros de datos antropométricos por NHC del paciente:',
        err
      );
      return res.status(500).json({
        mensaje: `Error al obtener registros de datos antropométricos para el paciente con NHC ${NHC_paciente}`,
        error: err.sqlMessage,
      });
    }
    if (datos.length === 0) {
      return res.status(404).json({
        mensaje:
          'No se encontraron registros de datos antropométricos para el paciente',
      });
    }
    res.status(200).json(datos);
  });
};

// Actualizar un registro de datos antropométricos por su ID
exports.update = (req, res) => {
  const idDatoAntropometrico = req.params.idDatoAntropometrico;
  const updatedData = req.body;

  const errores = validarDatosAntro(updatedData, true);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  datosAntroModel.updateById(
    idDatoAntropometrico,
    updatedData,
    (err, result) => {
      if (err) {
        console.error(
          'Error al actualizar registro de datos antropométricos:',
          err
        );
        return res.status(500).json({
          mensaje: 'Error al actualizar registro de datos antropométricos',
          error: err.sqlMessage,
        });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ mensaje: 'Registro de datos antropométricos no encontrado' });
      }
      res.status(200).json({
        mensaje: `Registro de datos antropométricos actualizado exitosamente`,
      });
    }
  );
};

// Eliminar un registro de datos antropométricos por su ID
exports.delete = (req, res) => {
  const idDatoAntropometrico = req.params.idDatoAntropometrico;

  datosAntroModel.removeById(idDatoAntropometrico, (err, result) => {
    if (err) {
      console.error(
        'Error al eliminar registro de datos antropométricos:',
        err
      );
      return res.status(500).json({
        mensaje: `Error al eliminar registro de datos antropométricos con ID ${idDatoAntropometrico}`,
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: 'Registro de datos antropométricos no encontrado' });
    }
    res.status(200).json({
      mensaje: `Registro de datos antropométricos eliminado exitosamente`,
    });
  });
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  findByPacienteNHC: exports.findByPacienteNHC,
  update: exports.update,
  delete: exports.delete,
};
