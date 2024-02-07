const bcrypt = require('bcryptjs');
const dbPool = require('../../server/db_connection.js');

const saltRounds = 10;

async function hashPasswords() {
  try {
    // Obtener todos los usuarios de la base de datos
    const [users] = await dbPool.query(
      'SELECT idUsuario, contrasena FROM usuario'
    );

    for (const user of users) {
      // Hashear la contraseña del usuario actual
      const hashedPassword = await bcrypt.hash(user.contrasena, saltRounds);

      // Actualizar la contraseña del usuario con la versión hasheada
      await dbPool.query(
        'UPDATE usuario SET contrasena = ? WHERE idUsuario = ?',
        [hashedPassword, user.idUsuario]
      );
    }

    console.log('Todas las contraseñas han sido hasheadas exitosamente.');
  } catch (err) {
    console.error('Error al hashear contraseñas:', err);
  }
}

// Llama a la función para ejecutar el script
hashPasswords();
