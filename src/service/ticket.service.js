const ticket = require("../models/tickets.model")
console.log("ticket model:", ticket)
const { getDataAPI } = require("./monday.service.js")
const config = require('../config/config.js')

let query = config.query
const url = config.url;
let access_token = config.mondayAccessToken
let query_cursor = config.query_cursor

const getQuery2 = async (cursor) => {
    let query_cursor2 = query_cursor.replace('${cursor}', cursor)
    return query_cursor2
}

const getValuesColumn = async (item) => {
    try {

        const subject = item.name
        const webUrl = item.url

        const dataColumn = item.column_values
        const getColumnText = (id) => {
            const column = dataColumn.find(column => column.id === id)
            return column ? column : null
        }
        const ticketNumber = getColumnText('id__de_elemento__1').text
        const status = getColumnText('estado4__1').text
        const category = getColumnText('estado__1').text
        const classification = getColumnText('estado0__1').text
        const methodofPayment = getColumnText('estado_12__1').text
        const area = getColumnText('estado_11__1').text

        // const createdTime = getColumnText('fecha_1__1').time
        const createdDate = getColumnText('fecha_1__1').text ? new Date(getColumnText('fecha_1__1').text) : null

        const closedTime = getColumnText('fecha3__1').text ? new Date(getColumnText('fecha3__1').text) : null
        const store = getColumnText('men__desplegable__1').text
        const agent = getColumnText('personas__1').text

        const ticketsDetail = {
            idTicket: ticketNumber,
            ticketNumber,
            subject,
            status,
            category,
            webUrl,
            classification,
            methodofPayment,
            area,
            createdDate,
            closedTime,
            storeName: store,
            agentName: agent,

        }

        return ticketsDetail


    } catch (e) {
        console.error("Error general ", e);
    }

}

const fetchFirstPage = async (req, res) => {
    try {
        const result = await getDataAPI(access_token, query, url)
        if (result.data && result.data.boards) {
            for (const board of result.data.boards) {
                if (board.items_page && board.items_page.items) {
                    for (const item of board.items_page.items) {
                        ticketData = await getValuesColumn(item)
                        ticketNumber = ticketData.ticketNumber
                        ticketMongo = await getValuesColumn(item)
                        // console.log("ticket numbers:", ticketNumber)
                        // console.log(" firstpage ticket es: ", ticketMongo)
                        try {
                            const updatedTicket = await ticket.findOneAndUpdate(
                                { ticketNumber: ticketNumber },
                                ticketMongo,
                                { upsert: true, new: true }
                            );
                            console.log("✅ Ticket creado o actualizado:");
                        } catch (dbError) {
                            console.error("❌ Error al actualizar/crear ticket en MongoDB:", dbError);
                        }

                        await new Promise(resolve => setTimeout(resolve, 100))
                        console.log('Ticket created o actualizado')
                    }
                    return board.items_page.cursor
                }
            }
        }
    } catch (error) {
        console.error("Error en fetchfirtpage ", error);
    }
}

const fetchNextPage = async (cursor) => {
    try {
        console.log('cursor en fetch: ', cursor)
        console.log('con la funcion: ', await getQuery2(cursor))
        const result = await getDataAPI(access_token, await getQuery2(cursor), url)
        console.log('result: ', result)
        if (result.data && result.data.next_items_page) {
            for (const item of result.data.next_items_page.items) {
                ticketData = await getValuesColumn(item)
                ticketNumber = ticketData.ticketNumber
                ticketMongo = await getValuesColumn(item)
                // console.log("ticket numbers:", ticketNumber)
                // console.log(" fetchnetxpage ticket es: ", ticketMongo)
                try {
                    const updatedTicket = await ticket.findOneAndUpdate(
                        { ticketNumber: ticketNumber },
                        ticketMongo,
                        { upsert: true, new: true }
                    );
                    console.log("✅ Ticket next creado o actualizado:");
                } catch (dbError) {
                    console.error("❌ Error al actualizar/crear ticket en MongoDB:", dbError);
                }
                await new Promise(resolve => setTimeout(resolve, 100))
                console.log('Ticket next created o actualizado')
            }
            return result.data.next_items_page.cursor
        }
    } catch (error) {
        console.error("Error en second fetch ", error);
    }
}

const updateTicketsMonday = async (req, res) => {
    try {
        let cursor = await fetchFirstPage()
        console.log('primer cursor: ', cursor)

        while (cursor) {
            console.log('cursor en el while ', cursor)
            cursor = await fetchNextPage(cursor)
            console.log('siguiente cursor: ', cursor)
        }
    } catch (error) {
        console.log("Error en update ", error);
    }

}

module.exports = { updateTicketsMonday, getQuery2, fetchNextPage }