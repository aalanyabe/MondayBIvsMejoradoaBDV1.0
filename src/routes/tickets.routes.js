const express = require("express")
const ticket = require("../models/tickets.model")
const router = express.Router()
const { syncTickets } = require("../controllers/ticket.controller")

router.get("/", async (req, res) => {
    try {
        
        console.log('✅ Iniciando sincronización...');
        await syncTickets(); // Sincronizar datos

        const getTicket = await ticket.find();
        res.json(getTicket)

        // console.log('✅ BD desconectada');
    } catch (error) {
        console.error('❌ Error en la sincronización y obtencion de datos:', error);
        res.status(500).json({ error: 'Error al obtener los tickets' });
    }
})

module.exports = router