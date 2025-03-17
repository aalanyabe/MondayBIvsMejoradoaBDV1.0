const { Schema, model, isObjectIdOrHexString } = require('mongoose')
const collection = 'tickets'

const ticketsSchema = new Schema({
    idTicket: {
        type: String,
        required: false
    },
    ticketNumber: {
        type: Number,
        required: true,
        index: false
    },
    subject: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    webUrl: {
        type: String,
        required: false
    },
    classification: {
        type: String,
        required: false
    },
    methodofPayment: {
        type: String,
        required: false
    },
    area: {
        type: String,
        required: false,
        default: null
    },
    createdTime: {
        type: Date,
        required: false
    },
    closedTime: {
        type: Date,
        required: false,
        default: null

    },
    resolutionTimeWorkingHours: {
        type: String,
        required: false
    },
    storeName: {
        type: String,
        required: false
    },
    agentName: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: false
    },
    ITservice: {
        type: String,
        required: false
    },
    ITrequeriment: {
        type: String,
        required: false
    },
    storeSupervisor: {
        type: String,
        required: false
    },
    previosPaymentMethod: {
        type: String,
        required: false
    },
    correctedPaymentMethod: {
        type: String,
        required: false
    },
    satisfaction: {
        type: String,
        required: false
    },
    Comments: {
        type: String,
        required: false
    }


})

module.exports = model(collection, ticketsSchema)