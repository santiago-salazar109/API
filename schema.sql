-- Script de inicialización para la base de datos del Archivo Digital
-- Este script define la estructura de almacenamiento basada en el modelado Entidad-Relación

-- 1. Creación de la tabla de documentos históricos
CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,                          -- Identificador único autoincremental
    titulo VARCHAR(255) NOT NULL,                   -- Título o signatura del expediente (Obligatorio)
    anio INT,                                       -- Año cronológico de la fuente
    ubicacion_archivo TEXT,                         -- Referencia física (Fondo, Caja, Carpeta)
    contexto_historico TEXT,                        -- Breve análisis del entorno socio-político
    transcripcion_paleografica TEXT                 -- Cuerpo textual del manuscrito editado
);

-- 2. Inserción de registros iniciales (Datos semilla para pruebas)
INSERT INTO documentos (titulo, anio, ubicacion_archivo, contexto_historico, transcripcion_paleografica)
VALUES 
('Expediente sobre disputa de tierras - Juana Quirós', 1785, 'Archivo General de la Nación, Sección Colonia, Caja 12, Carpeta 3', 'Litigio territorial civil procesado en el Virreinato durante las reformas borbónicas.', 'En la ciudad de... ante mí el escribano público compareció Juana Quirós, vecina de este partido...'),
('Manuscrito de cuentas de la Real Hacienda', 1792, 'Archivo Histórico Regional, Fondo Protocolos, Tomo 45', 'Registro de recaudación de impuestos locales de la corona española.', 'Cuenta y razón de los caudales de Real Hacienda pertenecientes al año de mil setecientos noventa y dos...');