const {Schema, model, isObjectIdOrHexString} = require('mongoose')
const collection = 'tickets'

const ticketsSchema = new Schema ({
    idTicket:{
        type: String,
        required: true
    },
    ticketNumber:{
        type: Number,
        required: true,
        index: true
    },
    subject:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    webUrl:{
        type: String,
        required: true
    },
    classification:{
        type: String,
        required: true
    },
    methodofPayment:{
        type: String,
        required: true
    },
    area:{
        type: String,
        required: true,
        default: null
    },
    createdTime:{
        type: Date,
        required: true
    },
    closedTime:{
        type: Date,
        required: false,
        default: null

    },
    resolutionTimeWorkingHours:{
        type: String,
        required: false
    },
    storeName:{
        type: String,
        required: true
    },
    agentName:{
        type: String,
        required: true
    },


})

module.exports = model(collection,ticketsSchema)