-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-01-2024 a las 20:30:41
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bbdd_clinica_sta_teresa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `idAgenda` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `horario` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda`
--

INSERT INTO `agenda` (`idAgenda`, `descripcion`, `horario`) VALUES
(1, 'Consulta Médica', 'Lunes 8:00 AM - 12:00 PM'),
(2, 'Rehabilitación Física', 'Martes 2:00 PM - 6:00 PM'),
(3, 'Control Prenatal', 'Miércoles 10:00 AM - 2:00 PM'),
(4, 'Cirugías Programadas', 'Jueves 9:00 AM - 1:00 PM'),
(5, 'Vacunación', 'Viernes 3:00 PM - 7:00 PM');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `idCita` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `NHC_paciente` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `agenda_id` int(11) DEFAULT NULL,
  `informacion_cita` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`idCita`, `fecha`, `hora`, `NHC_paciente`, `doctor_id`, `agenda_id`, `informacion_cita`) VALUES
(8, '2023-12-15', '40:58:44', 16, 12, 1, 'informacion_cita_1'),
(10, '2023-12-27', '10:30:00', 17, 12, 4, 'Información cita 1 para NHC 17'),
(11, '2023-12-28', '14:45:00', 18, 13, 3, 'Información cita 2 para NHC 18'),
(12, '2023-12-29', '11:15:00', 19, 14, 2, 'Información cita 3 para NHC 19'),
(13, '2023-12-30', '16:00:00', 17, 12, 4, 'Información cita 4 para NHC 17'),
(14, '2023-12-31', '09:00:00', 18, 13, 3, 'Información cita 5 para NHC 18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_antropometricos`
--

CREATE TABLE `datos_antropometricos` (
  `idDatoAntropometrico` int(11) NOT NULL,
  `NHC` int(11) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `IMC` decimal(5,2) DEFAULT NULL,
  `circunferencia_cintura` decimal(5,2) DEFAULT NULL,
  `circunferencia_cadera` decimal(5,2) DEFAULT NULL,
  `circunferencia_cabeza` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_antropometricos`
--

INSERT INTO `datos_antropometricos` (`idDatoAntropometrico`, `NHC`, `fecha_registro`, `peso`, `altura`, `IMC`, `circunferencia_cintura`, `circunferencia_cadera`, `circunferencia_cabeza`) VALUES
(1, 16, '2023-12-18', 55.00, 166.00, 18.00, 52.00, 6.00, NULL),
(2, 16, '2023-12-10', 54.00, 166.00, 18.00, 52.00, 6.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `episodio`
--

CREATE TABLE `episodio` (
  `idEpisodio` int(11) NOT NULL,
  `NHC` int(11) NOT NULL,
  `fecha_episodio` date DEFAULT NULL,
  `tipo_asistencia` varchar(20) DEFAULT NULL,
  `motivo_consulta` text DEFAULT NULL,
  `anamnesis` text DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `peso` decimal(10,2) DEFAULT NULL,
  `pa` decimal(5,2) DEFAULT NULL,
  `spo2` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `episodio`
--

INSERT INTO `episodio` (`idEpisodio`, `NHC`, `fecha_episodio`, `tipo_asistencia`, `motivo_consulta`, `anamnesis`, `diagnostico`, `tratamiento`, `peso`, `pa`, `spo2`) VALUES
(1, 16, '2023-12-14', 'diagnostica', 'dolor de cabeza y vómitos ', 'lleva vomitando 2 dias despues de cada comida ', 'intoxicación', 'ibuprofeno, agua ', NULL, NULL, NULL),
(10, 17, '2023-12-15', 'urgencia', 'dolor abdominal intenso', 'historial de problemas gastrointestinales', 'apendicitis aguda', 'cirugía de apendicitis', NULL, NULL, NULL),
(11, 18, '2023-12-16', 'diagnostica', 'fiebre y dolor de garganta', 'antecedentes de faringitis', 'fariginitis aguda', 'antibióticos y reposo', NULL, NULL, NULL),
(12, 19, '2023-12-17', 'urgencia', 'lesión en la pierna', 'sin antecedentes relevantes', 'fractura de tibia', 'yeso y reposo', NULL, NULL, NULL),
(13, 16, '2023-12-18', 'diagnostica', 'consulta de rutina', 'historial médico normal', 'sin diagnóstico específico', 'seguimiento de rutina', NULL, NULL, NULL),
(14, 19, '2023-12-19', 'urgencia', 'dolor en el pecho', 'historial de problemas cardíacos', 'infarto de miocardio', 'traslado a la unidad de cuidados intensivos', NULL, NULL, NULL),
(15, 17, '2023-12-15', 'urgencia', 'dolor abdominal intenso', 'historial de problemas gastrointestinales', 'apendicitis aguda', 'cirugía de apendicitis', NULL, NULL, NULL),
(16, 18, '2023-12-16', 'diagnostica', 'fiebre y dolor de garganta', 'antecedentes de faringitis', 'fariginitis aguda', 'antibióticos y reposo', NULL, NULL, NULL),
(17, 19, '2023-12-17', 'urgencia', 'lesión en la pierna', 'sin antecedentes relevantes', 'fractura de tibia', 'yeso y reposo', NULL, NULL, NULL),
(18, 16, '2023-12-18', 'diagnostica', 'consulta de rutina', 'historial médico normal', 'sin diagnóstico específico', 'seguimiento de rutina', NULL, NULL, NULL),
(19, 19, '2023-12-19', 'urgencia', 'dolor en el pecho', 'historial de problemas cardíacos', 'infarto de miocardio', 'traslado a la unidad de cuidados intensivos', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hce`
--

CREATE TABLE `hce` (
  `NHC_paciente` int(11) NOT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `grupo_sanguineo` varchar(10) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes_clinicos` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hce`
--

INSERT INTO `hce` (`NHC_paciente`, `sexo`, `grupo_sanguineo`, `alergias`, `antecedentes_clinicos`) VALUES
(16, 'F', 'AB+', 'alergia 1', 'antecedente clinico 1'),
(17, 'M', 'O+', 'sin alergias', 'antecedente clinico 2'),
(18, 'F', 'A-', 'alergia 2', 'sin antecedentes clínicos'),
(19, 'M', 'B+', 'sin alergias', 'antecedente clinico 3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_medicamentos`
--

CREATE TABLE `inventario_medicamentos` (
  `idMedicamento` int(11) NOT NULL,
  `cantidad_actual` int(11) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_medicamentos`
--

INSERT INTO `inventario_medicamentos` (`idMedicamento`, `cantidad_actual`, `fecha_registro`) VALUES
(1, 100, '2023-01-01'),
(2, 150, '2023-01-01'),
(3, 200, '2023-01-01'),
(4, 75, '2023-01-01'),
(5, 120, '2023-01-01'),
(6, 180, '2023-01-01'),
(7, 90, '2023-01-01'),
(8, 60, '2023-01-01'),
(9, 110, '2023-01-01'),
(10, 85, '2023-01-01'),
(1, 90, '2023-02-01'),
(2, 120, '2023-02-01'),
(3, 180, '2023-02-01'),
(4, 50, '2023-02-01'),
(5, 100, '2023-02-01'),
(6, 150, '2023-02-01'),
(7, 80, '2023-02-01'),
(8, 40, '2023-02-01'),
(9, 95, '2023-02-01'),
(10, 75, '2023-02-01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `idMedicamento` int(11) NOT NULL,
  `nombre_medicamento` varchar(100) NOT NULL,
  `principio_activo` varchar(100) DEFAULT NULL,
  `descripcion_medicamento` text DEFAULT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `forma_dispensacion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`idMedicamento`, `nombre_medicamento`, `principio_activo`, `descripcion_medicamento`, `fecha_caducidad`, `forma_dispensacion`) VALUES
(1, 'Aspirina', 'Ácido acetilsalicílico', 'Antiinflamatorio', '2023-01-01', 'Comprimido'),
(2, 'Paracetamol', 'Paracetamol', 'Analgésico', '2024-02-02', 'Jarabe'),
(3, 'Ibuprofeno', 'Ibuprofeno', 'Antiinflamatorio', '2023-03-03', 'Tableta'),
(4, 'Omeprazol', 'Omeprazol', 'Inhibidor de la bomba de protones', '2024-04-04', 'Cápsula'),
(5, 'Amoxicilina', 'Amoxicilina', 'Antibiótico', '2023-05-05', 'Tableta'),
(6, 'Atorvastatina', 'Atorvastatina', 'Estatina para reducir el colesterol', '2024-06-06', 'Tableta'),
(7, 'Diazepam', 'Diazepam', 'Ansiolítico y relajante muscular', '2023-07-07', 'Tableta'),
(8, 'Metformina', 'Metformina', 'Antidiabético oral', '2024-08-08', 'Tableta'),
(9, 'Losartán', 'Losartán', 'Antagonista del receptor de angiotensina II', '2023-09-09', 'Tableta'),
(10, 'Dipirona', 'Metamizol', 'Analgésico y antipirético', '2024-10-10', 'Tableta'),
(11, 'Ranitidina', 'Ranitidina', 'Antagonista del receptor H2', '2023-11-11', 'Tableta'),
(12, 'Levofloxacino', 'Levofloxacino', 'Antibiótico', '2024-12-12', 'Tableta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `NHC` int(11) NOT NULL,
  `tutor_info` text DEFAULT NULL,
  `grado` varchar(50) DEFAULT NULL,
  `otra_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`NHC`, `tutor_info`, `grado`, `otra_info`) VALUES
(16, 'Información Tutor 6', 'Grado6', 'Otra Información6'),
(17, 'Información Tutor 7', 'Grado7', 'Otra Información7'),
(18, 'Información Tutor 8', 'Grado8', 'Otra Información8'),
(19, 'Información Tutor 9', 'Grado9', 'Otra Información9'),
(20, 'Padre: Tutor Paciente 20', 'Tercero', 'Otra información del paciente 20'),
(21, 'Madre: Tutor Paciente 21', 'Cuarto', 'Otra información del paciente 21'),
(22, 'Padre: Tutor Paciente 22', 'Quinto', 'Otra información del paciente 22'),
(23, 'Madre: Tutor Paciente 23', 'Sexto', 'Otra información del paciente 23'),
(24, 'Padre: Tutor Paciente 24', 'Séptimo', 'Otra información del paciente 24'),
(25, 'Madre: Tutor Paciente 25', 'Octavo', 'Otra información del paciente 25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPersona` int(11) NOT NULL,
  `carnet_identidad` varchar(15) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido1` varchar(100) NOT NULL,
  `apellido2` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `escuela` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `municipio` varchar(50) DEFAULT NULL,
  `colonia` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPersona`, `carnet_identidad`, `nombre`, `apellido1`, `apellido2`, `fecha_nacimiento`, `escuela`, `telefono`, `email`, `departamento`, `municipio`, `colonia`, `direccion`) VALUES
(10, '111111111', 'Ana', 'López', 'Gutiérrez', '1992-03-15', 'Escuela4', '111111111', 'ana@example.com', 'Departamento4', 'Municipio4', 'Colonia4', 'Dirección4'),
(11, '222222222', 'Luis', 'Martínez', 'Hernández', '1988-07-20', 'Escuela5', '222222222', 'luis@example.com', 'Departamento5', 'Municipio5', 'Colonia5', 'Dirección5'),
(12, '333333333', 'Elena', 'Sánchez', 'Fernández', '1995-09-10', 'Escuela6', '333333333', 'elena@example.com', 'Departamento6', 'Municipio6', 'Colonia6', 'Dirección6'),
(13, '444444444', 'Carlos', 'González', 'Rodríguez', '1982-12-25', 'Escuela7', '444444444', 'carlos@example.com', 'Departamento7', 'Municipio7', 'Colonia7', 'Dirección7'),
(14, '555555555', 'Rosa', 'Ramírez', 'Pérez', '1998-04-05', 'Escuela8', '555555555', 'rosa@example.com', 'Departamento8', 'Municipio8', 'Colonia8', 'Dirección8'),
(15, '666666666', 'Jorge', 'Herrera', 'López', '1980-11-30', 'Escuela9', '666666666', 'jorge@example.com', 'Departamento9', 'Municipio9', 'Colonia9', 'Dirección9'),
(16, '777777777', 'Lucía', 'Díaz', 'Martínez', '1993-06-18', 'Escuela10', '777777777', 'lucia@example.com', 'Departamento10', 'Municipio10', 'Colonia10', 'Dirección10'),
(17, '888888888', 'Mario', 'Gómez', 'Fernández', '1990-08-22', 'Escuela11', '888888888', 'mario@example.com', 'Departamento11', 'Municipio11', 'Colonia11', 'Dirección11'),
(18, '999999999', 'Isabel', 'Ortiz', 'Santos', '1985-05-12', 'Escuela12', '999999999', 'isabel@example.com', 'Departamento12', 'Municipio12', 'Colonia12', 'Dirección12'),
(19, '1010101010', 'Juan', 'Pérez', 'González', '1996-09-28', 'Escuela13', '1010101010', 'juan@example.com', 'Departamento13', 'Municipio13', 'Colonia13', 'Dirección13'),
(20, '222222222', 'Persona 20', 'Apellido1 20', 'Apellido2 20', '2013-12-04', 'escuela 20', '202020202', 'email20@gmail.com', 'departamento 20', 'municipio 20', 'colonia 20', 'direccion20'),
(21, '212121212', 'Persona 21', 'Apellido1 21', 'Apellido2 21', '1990-08-15', 'escuela 21', '303030303', 'email21@gmail.com', 'departamento 21', 'municipio 21', 'colonia 21', 'direccion21'),
(22, '222222222', 'Persona 22', 'Apellido1 22', 'Apellido2 22', '1985-05-20', 'escuela 22', '404040404', 'email22@gmail.com', 'departamento 22', 'municipio 22', 'colonia 22', 'direccion22'),
(23, '232323232', 'Persona 23', 'Apellido1 23', 'Apellido2 23', '1998-11-10', 'escuela 23', '505050505', 'email23@gmail.com', 'departamento 23', 'municipio 23', 'colonia 23', 'direccion23'),
(24, '242424242', 'Persona 24', 'Apellido1 24', 'Apellido2 24', '1982-02-25', 'escuela 24', '606060606', 'email24@gmail.com', 'departamento 24', 'municipio 24', 'colonia 24', 'direccion24'),
(25, '252525252', 'Persona 25', 'Apellido1 25', 'Apellido2 25', '1995-09-05', 'escuela 25', '707070707', 'email25@gmail.com', 'departamento 25', 'municipio 25', 'colonia 25', 'direccion25'),
(26, '262626262', 'Persona 26', 'Apellido1 26', 'Apellido2 26', '1980-12-20', 'escuela 26', '808080808', 'email26@gmail.com', 'departamento 26', 'municipio 26', 'colonia 26', 'direccion26'),
(27, '272727272', 'Persona 27', 'Apellido1 27', 'Apellido2 27', '1993-06-02', 'escuela 27', '909090909', 'email27@gmail.com', 'departamento 27', 'municipio 27', 'colonia 27', 'direccion27'),
(28, '282828282', 'Persona 28', 'Apellido1 28', 'Apellido2 28', '1987-03-18', 'escuela 28', '1010101010', 'email28@gmail.com', 'departamento 28', 'municipio 28', 'colonia 28', 'direccion28'),
(29, '292929292', 'Persona 29', 'Apellido1 29', 'Apellido2 29', '1996-07-14', 'escuela 29', '1212121212', 'email29@gmail.com', 'departamento 29', 'municipio 29', 'colonia 29', 'direccion29'),
(30, '303030303', 'Persona 30', 'Apellido1 30', 'Apellido2 30', '1983-10-30', 'escuela 30', '1313131313', 'email30@gmail.com', 'departamento 30', 'municipio 30', 'colonia 30', 'direccion30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `receta`
--

CREATE TABLE `receta` (
  `idReceta` int(11) NOT NULL,
  `nhc_paciente` int(11) DEFAULT NULL,
  `id_medicamento` int(11) DEFAULT NULL,
  `id_medico` int(11) DEFAULT NULL,
  `fecha_receta` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `descripcion_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `descripcion_rol`) VALUES
(1, 'Administrador'),
(2, 'Administrativo'),
(3, 'Médico'),
(4, 'Enfermero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`idUsuario`, `idRol`) VALUES
(10, 1),
(11, 4),
(11, 4),
(12, 3),
(13, 4),
(14, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombre_usuario`, `contrasena`) VALUES
(10, 'anal_user', 'contrasena1'),
(11, 'luism_user', 'contrasena2'),
(12, 'elenas_user', 'contrasena3'),
(13, 'carlosg_user', 'contrasena4'),
(14, 'rosar_user', 'contrasena5');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`idAgenda`);

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`idCita`),
  ADD KEY `NHC_paciente` (`NHC_paciente`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `agenda_id` (`agenda_id`);

--
-- Indices de la tabla `datos_antropometricos`
--
ALTER TABLE `datos_antropometricos`
  ADD PRIMARY KEY (`idDatoAntropometrico`),
  ADD KEY `NHC` (`NHC`);

--
-- Indices de la tabla `episodio`
--
ALTER TABLE `episodio`
  ADD PRIMARY KEY (`idEpisodio`),
  ADD KEY `NHC` (`NHC`);

--
-- Indices de la tabla `hce`
--
ALTER TABLE `hce`
  ADD PRIMARY KEY (`NHC_paciente`);

--
-- Indices de la tabla `inventario_medicamentos`
--
ALTER TABLE `inventario_medicamentos`
  ADD KEY `medicamento_id` (`idMedicamento`);

--
-- Indices de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD PRIMARY KEY (`idMedicamento`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`NHC`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`idPersona`);

--
-- Indices de la tabla `receta`
--
ALTER TABLE `receta`
  ADD PRIMARY KEY (`idReceta`),
  ADD KEY `nhc_paciente` (`nhc_paciente`),
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD KEY `idRol` (`idRol`),
  ADD KEY `rolusuario_ibfk_1` (`idUsuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agenda`
--
ALTER TABLE `agenda`
  MODIFY `idAgenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `idCita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `datos_antropometricos`
--
ALTER TABLE `datos_antropometricos`
  MODIFY `idDatoAntropometrico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `episodio`
--
ALTER TABLE `episodio`
  MODIFY `idEpisodio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `idMedicamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPersona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `receta`
--
ALTER TABLE `receta`
  MODIFY `idReceta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`NHC_paciente`) REFERENCES `paciente` (`NHC`),
  ADD CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`agenda_id`) REFERENCES `agenda` (`idAgenda`);

--
-- Filtros para la tabla `datos_antropometricos`
--
ALTER TABLE `datos_antropometricos`
  ADD CONSTRAINT `datos_antropometricos_ibfk_1` FOREIGN KEY (`NHC`) REFERENCES `paciente` (`NHC`);

--
-- Filtros para la tabla `episodio`
--
ALTER TABLE `episodio`
  ADD CONSTRAINT `episodio_ibfk_1` FOREIGN KEY (`NHC`) REFERENCES `paciente` (`NHC`);

--
-- Filtros para la tabla `hce`
--
ALTER TABLE `hce`
  ADD CONSTRAINT `hce_ibfk_1` FOREIGN KEY (`NHC_paciente`) REFERENCES `paciente` (`NHC`);

--
-- Filtros para la tabla `inventario_medicamentos`
--
ALTER TABLE `inventario_medicamentos`
  ADD CONSTRAINT `inventario_medicamentos_ibfk_1` FOREIGN KEY (`idMedicamento`) REFERENCES `medicamento` (`idMedicamento`);

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `paciente_ibfk_1` FOREIGN KEY (`NHC`) REFERENCES `persona` (`idPersona`);

--
-- Filtros para la tabla `receta`
--
ALTER TABLE `receta`
  ADD CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`nhc_paciente`) REFERENCES `paciente` (`NHC`),
  ADD CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamento` (`idMedicamento`),
  ADD CONSTRAINT `receta_ibfk_3` FOREIGN KEY (`id_medico`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD CONSTRAINT `rol_usuario_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `rol_usuario_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `persona` (`idPersona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
