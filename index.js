const express = require('express');
const app = express();
const PORT = 3000;

// Middleware crítico: Configura el servidor para parsear e interpretar 
// estructuras de datos complejas enviadas en formato JSON dentro del cuerpo (body) de las peticiones.
app.use(express.json());

/**
 * REPOSITORIO PROVISIONAL EN MEMORIA (MOCK DATA)
 * Representa de forma temporal la estructura de nuestro archivo histórico digital.
 * Cada objeto simula un registro documental con sus respectivos metadatos archivísticos y paleográficos.
 * NOTA: Este arreglo se eliminará una vez se implemente la persistencia de datos en la base de datos SQL.
 */
const documentosHistoricos = [
    {
        id: 1,
        titulo: "Expediente sobre disputa de tierras - Juana Quirós",
        anio: 1785,
        ubicacion_archivo: "Archivo General de la Nación, Sección Colonia, Caja 12, Carpeta 3",
        contexto_historico: "Litigio territorial civil procesado en el Virreinato durante las reformas borbónicas.",
        transcripcion_paleografica: "En la ciudad de... ante mí el escribano público compareció Juana Quirós, vecina de este partido..."
    },
    {
        id: 2,
        titulo: "Manuscrito de cuentas de la Real Hacienda",
        anio: 1792,
        ubicacion_archivo: "Archivo Histórico Regional, Fondo Protocolos, Tomo 45",
        contexto_historico: "Registro de recaudación de impuestos locales de la corona española.",
        transcripcion_paleografica: "Cuenta y razón de los caudales de Real Hacienda pertenecientes al año de mil setecientos noventa y dos..."
    }
];

/**
 * ENDPOINT 1: CONSULTA GENERAL DEL CATÁLOGO (GET)
 * Ruta: /api/documentos
 * Objetivo: Recuperar la totalidad de los folios indexados en el sistema.
 * Retorna un objeto que indica el volumen total de registros y el arreglo con los datos.
 */
app.get('/api/documentos', (req, res) => {
    res.json({
        total: documentosHistoricos.length, // Control cuantitativo del inventario
        datos: documentosHistoricos
    });
});

/**
 * ENDPOINT 2: BÚSQUEDA SELECTIVA POR UNIDAD DE REGISTRO (GET)
 * Ruta: /api/documentos/:id
 * Objetivo: Localizar un expediente específico mediante su código identificador único.
 */
app.get('/api/documentos/:id', (req, res) => {
    // Captura el parámetro dinámico de la URL y lo convierte a entero para la comparación
    const idBuscado = parseInt(req.params.id);
    // Ejecuta una búsqueda indexada dentro de nuestro repositorio temporal
    const documento = documentosHistoricos.find(doc => doc.id === idBuscado);

    // Protocolo de contingencia: Si el ID no corresponde a ningún documento del archivo
    if (!documento) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `No existe ningún registro con el ID ${idBuscado} en las arcas digitales.`
        });
    }

    // Retorna el expediente localizado con éxito
    res.json(documento);
});

/**
 * ENDPOINT 3: INCORPORACIÓN DE NUEVOS EXPEDIENTES AL ARCHIVO (POST)
 * Ruta: /api/documentos
 * Objetivo: Catalogar y almacenar un nuevo documento histórico con su transcripción elemental.
 */
app.post('/api/documentos', (req, res) => {
    // Construcción del nuevo registro mapeando las propiedades validadas del cuerpo de la petición
    const nuevoDocumento = {
        id: documentosHistoricos.length + 1, // Asignación automática del consecutivo del registro
        titulo: req.body.titulo,
        anio: req.body.anio,
        ubicacion_archivo: req.body.ubicacion_archivo,
        contexto_historico: req.body.contexto_historico,
        transcripcion_paleografica: req.body.transcripcion_paleografica
    };

    // Control de calidad de la información: El título es un metadato obligatorio para la catalogación
    if (!nuevoDocumento.titulo) {
        return res.status(400).json({
            error: "Solicitud incorrecta",
            mensaje: "Fallo de indexación: El campo 'titulo' es mandatorio para registrar el documento."
        });
    }

    // Inserta el nuevo registro en el arreglo en memoria
    documentosHistoricos.push(nuevoDocumento);
    
    // Código HTTP 201: Indica que el recurso fue creado y asentado correctamente
    res.status(201).json({
        mensaje: "Documento histórico registrado con éxito en el catálogo",
        dato: nuevoDocumento
    });
});

/**
 * ENDPOINT 4: ACTUALIZACIÓN INTERNA DE METADATOS O TRANSCRIPCIONES (PUT)
 * Ruta: /api/documentos/:id
 * Objetivo: Modificar, corregir o expandir la información o transcripción paleográfica de un documento existente.
 */
app.put('/api/documentos/:id', (req, res) => {
    // Validación preventiva: Bloquea la petición si el cuerpo del JSON llega vacío o mal configurado en Postman
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Solicitud incorrecta",
            mensaje: "No se detectaron metadatos válidos en el cuerpo de la petición para proceder con la actualización."
        });
    }

    const idBuscado = parseInt(req.params.id);
    const documento = documentosHistoricos.find(doc => doc.id === idBuscado);

    // Valida si la unidad documental que se intenta editar realmente preexiste
    if (!documento) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `Imposible actualizar: El registro con ID ${idBuscado} no figura en el sistema.`
        });
    }

    // Operación lógica de fusión (Fuzzy update): Conserva el valor histórico original 
    // si el usuario no envía una actualización específica para ese campo
    documento.titulo = req.body.titulo || documento.titulo;
    documento.anio = req.body.anio || documento.anio;
    documento.ubicacion_archivo = req.body.ubicacion_archivo || documento.ubicacion_archivo;
    documento.contexto_historico = req.body.contexto_historico || documento.contexto_historico;
    documento.transcripcion_paleografica = req.body.transcripcion_paleografica || documento.transcripcion_paleografica;

    res.json({
        mensaje: "Metadatos del documento histórico actualizados con éxito",
        dato: documento
    });
});

/**
 * ENDPOINT 5: DEPURACIÓN O EXPULSIÓN DE REGISTROS (DELETE)
 * Ruta: /api/documentos/:id
 * Objetivo: Remover un documento del inventario digital por error de duplicidad o reclasificación.
 */
app.delete('/api/documentos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    // Localiza el índice de posición física del objeto dentro del arreglo
    const indice = documentosHistoricos.findIndex(doc => doc.id === idBuscado);

    // Verifica si el registro existe antes de proceder a la remoción
    if (indice === -1) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `Imposible eliminar: El documento con ID ${idBuscado} no se encuentra indexado.`
        });
    }

    // Método splice: Extrae el elemento del arreglo mutando el tamaño del inventario en memoria
    const documentoEliminado = documentosHistoricos.splice(indice, 1);

    res.json({
        mensaje: "Documento removido correctamente del archivo digital",
        dato: documentoEliminado[0] // Retorna el objeto eliminado como constancia del acto
    });
});

// Inicialización del proceso de escucha en la interfaz de red local
app.listen(PORT, () => {
    console.log(`[Servidor Activo] Escuchando peticiones HTTP correctamente en el puerto local ${PORT}`);
});