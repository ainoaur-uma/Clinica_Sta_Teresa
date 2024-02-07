/*
  Archivo de Configuración y Conexión a la Base de Datos
  
  Este archivo configura la conexión a la base de datos MySQL utilizando un pool de conexiones.
  Utiliza la biblioteca 'dotenv' para cargar las variables de entorno desde un archivo '.env',
*/
const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config(); //

//Creación del pool de conexiones para manejar multiples conexiones a la bbdd de manera simultánea
const dbPool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

/*
  Se solicita la conexion: Si hay un error durante la conexión, se imprime un mensaje de error. 
  Si la conexión es exitosa, se imprime un mensaje de éxito.
 */
// Verificar conexión a la base de datos
const checkConnection = async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release(); // Devuelve la conexión al pool
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
  }
};

checkConnection(); // Llama a la función para verificar la conexión

module.exports = dbPool;
