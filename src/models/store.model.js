const { Schema, model} = require('mongoose')
const collection = 'store'

const storeSchema = new Schema({
    storeNumber: {
        type: String,
        required: false
    },
    storeName: {
        type: String,
        required: true,
        index: false
    },
    supervisor: {
        type: String,
        required: false
    },
    zonalSupervisor: {
        type: String,
        required: false
    }

})

module.exports = model(collection, storeSchema)