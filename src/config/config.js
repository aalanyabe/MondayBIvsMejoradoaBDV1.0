
const dotenv = require("dotenv")
const {commander} = require('../utils/commander.js')

const { mode } = commander.opts() //according to what you request // // nodemon src/app --mode production
const environment = mode || "development"
dotenv.config({
    path: environment === 'development' ? './.env.development' : './.env.production'
})

module.exports = {
    port: process.env.PORT || 3000,
    mondayAccessToken: process.env.MONDAY_ACCESS_TOKEN,
    url: process.env.URL,
    query: process.env.QUERY,
    querystore: process.env.QUERYSTORE,
    query_cursor: process.env.QUERY_CURSOR,
    dbSettings: {
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        server: process.env.SERVER,
        database: process.env.DATABASE,
        mongo_uri: process.env.MONGO_URI,
        database_name: process.env.DATABASE_NAME,
        collection_name: process.env.COLLETION_NAME,
        port: process.env.PORT,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
}

//Nota: el nombre de la base de datos en este caso se coloca en el uri