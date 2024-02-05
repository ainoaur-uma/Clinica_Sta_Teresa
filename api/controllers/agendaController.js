// Importar el modelo
const agendaModel = require('../models/agendaModel');

// Validar los datos de la agenda
const validarAgenda = (agenda, isUpdating = false) => {
  const errores = [];

  if (!isUpdating) {
    // Validaciones para la creación
    if (!agenda.descripcion) {
      errores.push('La descripción de la agenda es requerida.');
    }
  } else {
    // Validaciones solo para los campos proporcionados en la actualización
    if (agenda.descripcion !== undefined && !agenda.descripcion)
      errores.push('La descripcion de la agenda es requerida');
  }
  return errores;
};

// Crea una nueva agenda
exports.create = (req, res) => {
  const nuevaAgenda = {
    descripcion: req.body.descripcion,
    horario: req.body.horario,
  };
  const errores = validarAgenda(nuevaAgenda);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  agendaModel.create(nuevaAgenda, (err, agenda) => {
    if (err) {
      console.error('Error al crear la agenda:', err);
      return res
        .status(500)
        .json({ mensaje: 'Error al crear la agenda', error: err.sqlMessage });
    }
    res.status(201).json(agenda);
  });
};

// Obtiene todas las agendas
exports.findAll = (req, res) => {
  agendaModel.getAll((err, agendas) => {
    if (err) {
      console.error('Error al obtener las agendas:', err);
      return res.status(500).json({
        mensaje: 'Error al obtener las agendas',
        error: err.sqlMessage,
      });
    }
    res.status(200).json(agendas);
  });
};

// Obtiene una agenda por su ID
exports.findOne = (req, res) => {
  const agendaId = req.params.idAgenda;
  if (!agendaId) {
    return res
      .status(400)
      .json({ mensaje: 'ID de la agenda no proporcionado' });
  }

  agendaModel.findById(agendaId, (err, agenda) => {
    if (err) {
      console.error('Error al obtener la agenda:', err);
      return res.status(500).json({
        mensaje: `Error al obtener la agenda con ID ${agendaId}`,
        error: err.sqlMessage,
      });
    }
    if (!agenda) {
      return res.status(404).json({ mensaje: 'Agenda no encontrada' });
    }
    res.status(200).json(agenda);
  });
};

// Actualiza una agenda por su ID usando PATCH
exports.update = (req, res) => {
  const agendaId = req.params.idAgenda;
  const updatedData = req.body;
  const errores = validarAgenda(updatedData, true);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores });
  }

  agendaModel.updateById(agendaId, updatedData, (err, result) => {
    if (err) {
      console.error('Error al actualizar la agenda por su ID :', err);
      return res.status(500).json({
        mensaje: 'Error al actualizar la agenda por su ID :',
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Agenda no encontrada' });
    }
    res
      .status(200)
      .json({ mensaje: `Agenda con ID ${agendaId} actualizada exitosamente` });
  });
};

// Elimina una agenda por su ID
exports.delete = (req, res) => {
  const agendaId = req.params.idAgenda;

  agendaModel.remove(agendaId, (err, result) => {
    if (err) {
      console.error('Error al eliminar la agenda:', err);
      return res.status(500).json({
        mensaje: `Error al eliminar la agenda con ID ${agendaId}`,
        error: err.sqlMessage,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Agenda no encontrada' });
    }
    res
      .status(200)
      .json({ mensaje: `Agenda con ID ${agendaId} eliminada exitosamente` });
  });
};

// Exportar las funciones del controlador
module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  delete: exports.delete,
};
