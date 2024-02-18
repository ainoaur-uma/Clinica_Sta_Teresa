const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const autenticacionController = {
  /**
   * Maneja el proceso de login verificando las credenciales del usuario y generando un token JWT si son correctas.
   * Valida los datos de entrada para asegurarse de que tanto el nombre de usuario como la contraseña se han proporcionado.
   * Si los datos son válidos, busca al usuario por su nombre de usuario y verifica que la contraseña coincida.
   * Si la autenticación es exitosa, crea y envía un token JWT; de lo contrario, envía el error correspondiente.
   */
  async login(req, res) {
    const { nombre_usuario, contrasena } = req.body;

    // Validación de datos de entrada
    if (!nombre_usuario || !contrasena) {
      return res.status(400).send({
        error: 'CamposRequeridos',
        mensaje: 'Nombre de usuario y contraseña son requeridos.',
      });
    }

    try {
      // Buscar el usuario por su nombre de usuario
      const usuario = await usuarioModel.findByUsername(nombre_usuario);

      if (!usuario) {
        return res.status(404).send({
          error: 'UsuarioNoEncontrado',
          mensaje: 'Nombre de usuario no registrado.',
        });
      }

      // Verificar la contraseña
      const contraseñaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena
      );
      if (!contraseñaValida) {
        return res.status(401).send({
          error: 'ContraseñaIncorrecta',
          mensaje:
            'La contraseña es incorrecta, por favor revise los datos introducidos.',
        });
      }

      // Crear y firmar el token JWT
      const token = jwt.sign(
        { id: usuario.idUsuario },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 24 horas
        }
      );

      res.status(200).send({ auth: true, token });
    } catch (error) {
      res.status(500).send({
        error: 'ErrorServidor',
        mensaje: 'Error en el servidor.',
        detalles: error.message,
      });
    }
  },
};

module.exports = autenticacionController;
