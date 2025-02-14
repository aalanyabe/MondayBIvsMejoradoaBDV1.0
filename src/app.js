const cron = require('node-cron')
const { conectMongoDB,disconectMongoDB } = require('./config/db')
const { syncTickets } = require('./controllers/ticket.controller')


const startSync = async () => {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await conectMongoDB();
        console.log('✅ BD conectada, iniciando sincronización...');

        await syncTickets(); // Sincronizar datos

        console.log('🔄 Desconectando de MongoDB...');
        await disconectMongoDB();
        console.log('✅ BD desconectada');
    } catch (error) {
        console.error('❌ Error en la sincronización:', error);
    }
    
};

// Ejecutando sincronización al iniciar
startSync();

// Ejecutar cada 2h
cron.schedule('0 */2 * * *', async () => {
    console.log('🔄 Ejecutando sincronización...');
    await startSync();
})