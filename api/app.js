const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const dbPool = require('../server/db_connection');
const verificarToken = require('./middlewares/autenticacion');

// Middleware para analizar el cuerpo JSON
app.use(express.json());
app.use(bodyParser.json());

// Configuración de CORS para un dominio específico
const corsOptions = {
  origin: 'http://localhost:4200',
};

app.use(cors(corsOptions));

// Importa las rutas de las entidades
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const personaRoutes = require('./routes/personaRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const inventarioMedicamentosRoutes = require('./routes/inventarioMedicamentosRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const hceRoutes = require('./routes/hceRoutes');
const recetaRoutes = require('./routes/recetaRoutes');
const episodioRoutes = require('./routes/episodioRoutes');
const datosAntroRoutes = require('./routes/datosAntroRoutes');
const citaRoutes = require('./routes/citaRoutes');
const autenticacionRoutes = require('./routes/autenticacionRoutes');

// Middleware de autenticación aplicado a todas las rutas bajo el prefijo '/api'
app.use('/api', verificarToken);

// Define las rutas para las entidades bajo el prefijo '/api'
app.use('/api/rol', rolRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/medicamento', medicamentoRoutes);
app.use('/api/inventarioMedicamentos', inventarioMedicamentosRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/paciente', pacienteRoutes);
app.use('/api/hce', hceRoutes);
app.use('/api/receta', recetaRoutes);
app.use('/api/episodio', episodioRoutes);
app.use('/api/datosAntropometricos', datosAntroRoutes);
app.use('/api/cita', citaRoutes);

//ruta de inicio sin proteger con '/api:
app.use('/autenticacion', autenticacionRoutes);

// Ruta de bienvenida sin proteger, como ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

module.exports = app;
