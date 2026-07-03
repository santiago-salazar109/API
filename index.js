const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de datos temporal en memoria
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

// 1. Obtener todos los documentos (GET)
app.get('/api/documentos', (req, res) => {
    res.json({
        total: documentosHistoricos.length,
        datos: documentosHistoricos
    });
});

// 2. Buscar un documento por ID (GET)
app.get('/api/documentos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const documento = documentosHistoricos.find(doc => doc.id === idBuscado);

    if (!documento) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `No existe ningún registro con el ID ${idBuscado}`
        });
    }
    res.json(documento);
});

// 3. Crear un nuevo documento (POST)
app.post('/api/documentos', (req, res) => {
    const nuevoDocumento = {
        id: documentosHistoricos.length + 1,
        titulo: req.body.titulo,
        anio: req.body.anio,
        ubicacion_archivo: req.body.ubicacion_archivo,
        contexto_historico: req.body.contexto_historico,
        transcripcion_paleografica: req.body.transcripcion_paleografica
    };

    if (!nuevoDocumento.titulo) {
        return res.status(400).json({
            error: "Solicitud incorrecta",
            mensaje: "El campo 'titulo' es obligatorio."
        });
    }

    documentosHistoricos.push(nuevoDocumento);
    res.status(201).json({
        mensaje: "Documento histórico registrado con éxito",
        dato: nuevoDocumento
    });
});

// 4. Actualizar un documento existente (PUT)
app.put('/api/documentos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const documento = documentosHistoricos.find(doc => doc.id === idBuscado);

    if (!documento) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `No se puede actualizar porque no existe el ID ${idBuscado}`
        });
    }

    // Modificamos los campos sólo si el usuario envía nueva información, de lo contrario dejamos el valor original
    documento.titulo = req.body.titulo || documento.titulo;
    documento.anio = req.body.anio || documento.anio;
    documento.ubicacion_archivo = req.body.ubicacion_archivo || documento.ubicacion_archivo;
    documento.contexto_historico = req.body.contexto_historico || documento.contexto_historico;
    documento.transcripcion_paleografica = req.body.transcripcion_paleografica || documento.transcripcion_paleografica;

    res.json({
        mensaje: "Documento actualizado con éxito",
        dato: documento
    });
});

// 5. Eliminar un documento (DELETE)
app.delete('/api/documentos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const indice = documentosHistoricos.findIndex(doc => doc.id === idBuscado);

    if (indice === -1) {
        return res.status(404).json({
            error: "Documento no encontrado",
            mensaje: `No se puede eliminar porque no existe el ID ${idBuscado}`
        });
    }

    // Removemos el documento del arreglo usando su índice de posición
    const documentoEliminado = documentosHistoricos.splice(indice, 1);

    res.json({
        mensaje: "Documento eliminado correctamente del archivo digital",
        dato: documentoEliminado[0]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose correctamente en el puerto ${PORT}`);
});