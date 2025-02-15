const express = require("express")
const ticket = require("../models/tickets.model")
const router = express.Router()
const { syncTickets } = require("../controllers/ticket.controller")

router.get("/", async (req, res) => {
    try {

        // // Obtener y devolver los tickets antes de sincronizar
        // const getTicket = await ticket.find();
        // res.json(getTicket);

        // console.log('✅ Tickets recibido, iniciando sincronización en segundo plano...');

        // // Ejecutar la sincronización sin bloquear la respuesta
        // syncTickets().catch(err => console.error('❌ Error en la sincronización:', err));
        await syncTickets()
        const getTicket = await ticket.find();
        res.json(getTicket)


    } catch (error) {
        console.error('❌ Error en la sincronización y obtencion de datos:', error);
        res.status(500).json({ error: 'Error al obtener los tickets' });
    }
})

module.exports = router