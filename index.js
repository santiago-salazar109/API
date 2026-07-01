const express = require('express');
const app = express();
const PORT = 3000;

// Configuración para que el servidor entienda formato JSON
app.use(express.json());

// Ruta base de prueba (Endpoint)
app.get('/api/documentos', (req, res) => {
    res.json({
        mensaje: "Conexión exitosa con la API de Gestión de Archivos Históricos",
        estado: "En desarrollo"
    });
});

// Inicialización del servidor para escuchar peticiones
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose correctamente en el puerto ${PORT}`);
});