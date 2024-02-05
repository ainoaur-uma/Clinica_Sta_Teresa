/*
  Archivo principal para iniciar el servidor.
  Este archivo se encarga de iniciar el servidor utilizando el módulo 'app'.
  Obtiene el puerto desde las variables de entorno o utiliza el puerto 3000 por defecto.
*/
const app = require('../api/app.js');

// Obtiene el puerto desde las variables de entorno o utiliza un valor predeterminado
const port = process.env.PORT || 3000;

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
