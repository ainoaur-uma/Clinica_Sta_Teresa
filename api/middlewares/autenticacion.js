/** Importamos el módulo jsonwebtoken, que nos permite trabajar con JWT (JSON Web Tokens) */
const jwt = require('jsonwebtoken');

/**
 * Definimos y exportamos la función 'verificarToken', la cual será nuestro middleware de autenticación.
 * Esta función intentará verificar el token JWT proporcionado en las solicitudes a las rutas protegidas.
 */
const verificarToken = (req, res, next) => {
  // Intentamos obtener el token del header 'Authorization' de la solicitud entrante.
  let token = req.headers['authorization'];

  // Verificamos si el token existe. Si no existe, respondemos con un error 403 (Prohibido).
  if (!token) {
    return res
      .status(403)
      .send({ mensaje: 'No se proporcionó token de autenticación.' });
  }

  /**
   * Opcionalmente, quitamos el prefijo 'Bearer ' del token.
   * Los tokens JWT a menudo se envían como 'Bearer <token>', así que quitamos ese prefijo para obtener solo el token.
   */
  if (token.startsWith('Bearer ')) {
    // Cortamos el string 'Bearer ' del inicio del token para quedarnos solo con el token JWT.
    token = token.slice(7, token.length);
  }

  /**
   * Usamos jwt.verify para verificar el token.
   * El primer argumento es el token a verificar.
   * El segundo argumento es la clave secreta con la que el token fue firmado.
   * El tercer argumento es un callback que se llama con el resultado de la verificación.
   */
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Si hay un error durante la verificación (por ejemplo, si el token es inválido o ha expirado), respondemos con un error 401 (No autorizado).
    if (err) {
      return res
        .status(401)
        .send({ mensaje: 'No autorizado. Token inválido o expirado.' });
    }

    // Si el token es válido, el payload decodificado se asigna a 'req.usuario'.
    // Esto nos permite acceder a la información del usuario en las rutas protegidas.
    req.usuario = decoded;

    // Llamamos a 'next()' para pasar el control al siguiente middleware (o al controlador de la ruta, si no hay más middleware).
    next();
  });
};

// Exportamos la función 'verificarToken' para que pueda ser utilizada en otras partes de nuestra aplicación.
module.exports = verificarToken;
