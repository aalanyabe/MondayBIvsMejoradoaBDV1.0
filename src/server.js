require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets.routes');
const config = require('./config/config.js')
const { conectMongoDB } = require('./config/db.js')


const app = express();
const PORT = config.port || 3000;

console.log('🔄 Conectando a MongoDB...');
conectMongoDB()
    .then(() => {
        console.log("✅ Conexión a MongoDB establecida");

        // Middleware
        app.use(cors());
        app.use(express.json());

        // Rutas
        app.use('/api/tickets', ticketRoutes);

        //Midleware de manejo de errores
        app.use((err, req, res, next) => {
            console.log("❌ Error en el servidor:", err)
            res.status(500).json({ error: "Error interno del servidor" })
        })

        //Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Error al conectar con MongoDB:", error)
        process.exit(1); // Termina el proceso si no puede conectar a la BD
    })

