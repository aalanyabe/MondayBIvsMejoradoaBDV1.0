const express = require("express")
const store = require("../models/store.model")
const router = express.Router()
const {syncStore}=require("../controllers/store.controller")

router.get("/", async (req, res) => {
    try {

        // // Obtener y devolver los tickets antes de sincronizar
        // const getTicket = await ticket.find();
        // res.json(getTicket);

        // console.log('✅ Tickets recibido, iniciando sincronización en segundo plano...');

        // // Ejecutar la sincronización sin bloquear la respuesta
        // syncTickets().catch(err => console.error('❌ Error en la sincronización:', err));
        await syncStore()
        const getStore = await store.find();
        res.json(getStore)


    } catch (error) {
        console.error('❌ Error en la sincronización y obtencion de datos:', error);
        res.status(500).json({ error: 'Error al obtener los store' });
    }
})

module.exports = router