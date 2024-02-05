/**
 * Script de Migración recorra todas las entradas de la base de datos, hashee las contraseñas
 * en texto plano y actualice cada usuario con su nueva contraseña hasheada
 * **/
require('dotenv').config(); // Asegúrate de que esta línea esté al principio para cargar las variables de entorno
const bcrypt = require('bcryptjs');
const db = require('../../server/db_connection');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

const updatePassword = async (usuario) => {
  const hashedPassword = await bcrypt.hash(usuario.contrasena, saltRounds);
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE usuario SET contrasena = ? WHERE idUsuario = ?',
      [hashedPassword, usuario.idUsuario],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const migratePasswords = async () => {
  db.query(
    'SELECT idUsuario, contrasena FROM usuario',
    async (err, usuarios) => {
      if (err) {
        console.error('Error al consultar usuarios:', err);
        process.exit(1);
      }

      for (let usuario of usuarios) {
        try {
          await updatePassword(usuario);
          console.log(
            `Contraseña actualizada para el usuario: ${usuario.idUsuario}`
          );
        } catch (error) {
          console.error(
            `Error al actualizar el usuario ${usuario.idUsuario}:`,
            error
          );
        }
      }

      console.log('Migración de contraseñas completada.');
      process.exit(0); // Sale del script una vez completado
    }
  );
};

migratePasswords();
