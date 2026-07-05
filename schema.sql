```sql
-- Script de inicializacion para la base de datos relacional del Archivo Digital
-- Define la estructura normalizada de cuatro tablas interconectadas

-- 1. Tabla de Fondos Archivisticos
CREATE TABLE IF NOT EXISTS fondos_archivisticos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 2. Tabla de Investigadores (Usuarios del sistema)
CREATE TABLE IF NOT EXISTS investigadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(50) DEFAULT 'Investigador'
);

-- 3. Tabla de Documentos Historicos (Entidad Central)
CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    fondo_id INT REFERENCES fondos_archivisticos(id) ON DELETE SET NULL,
    investigador_id INT REFERENCES investigadores(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    anio INT,
    ubicacion_fisica TEXT,
    contexto_historico TEXT
);

-- 4. Tabla de Transcripciones Paleograficas (Relacion multidocumental)
CREATE TABLE IF NOT EXISTS transcripciones (
    id SERIAL PRIMARY KEY,
    documento_id INT REFERENCES documentos(id) ON DELETE CASCADE,
    investigador_id INT REFERENCES investigadores(id) ON DELETE SET NULL,
    texto_paleografico TEXT NOT NULL,
    notas_criticas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insercion de datos semilla para validacion del sistema relacional
INSERT INTO fondos_archivisticos (nombre, descripcion) VALUES
('Seccion Colonia', 'Documentacion civil, eclesiastica y militar del periodo virreinal.'),
('Fondo Protocolos', 'Registros notariales y escrituras publicas regionales.');

INSERT INTO investigadores (nombre, correo, rol) VALUES
('Santiago Salazar', 'santiago.salazar109@example.com', 'Investigador Principal');

INSERT INTO documentos (fondo_id, investigador_id, titulo, anio, ubicacion_fisica, contexto_historico) VALUES
(1, 1, 'Expediente sobre disputa de tierras - Juana Quiros', 1785, 'Archivo General de la Nacion, Caja 12, Carpeta 3', 'Litigio territorial civil procesado en el Virreinato durante las reformas bourbonicas.'),
(2, 1, 'Manuscrito de cuentas de la Real Hacienda', 1792, 'Archivo Historico Regional, Tomo 45', 'Registro de recaudacion de impuestos locales de la corona espanola.');

INSERT INTO transcripciones (documento_id, investigador_id, texto_paleografico, notas_criticas) VALUES
(1, 1, 'En la ciudad de... ante mi el escribano publico comparecio Juana Quiros...', 'Transcripcion preliminar sujeta a revision de grafias.'),
(2, 1, 'Cuenta y razon de los caudales de Real Hacienda pertenecientes al ano de...', 'Registro completo con firmas validadas.');