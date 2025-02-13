const { connect,disconnect } = require('mongoose');
const config  = require("../config/config.js")

const conectMongoDB = async () => {
    try {
        await connect(config.dbSettings.mongo_uri)
        console.log('BD conectado')

    } catch (err) {
        console.log("DB no conectado: ",err);
        process.exit();
    }

}

const disconectMongoDB = async () => {
    try {
        await disconnect()
        console.log('BD desconectado')

    } catch (err) {
        console.log("DB no desconectado: ",err);
        process.exit();
    }

}

module.exports = { conectMongoDB,disconectMongoDB }