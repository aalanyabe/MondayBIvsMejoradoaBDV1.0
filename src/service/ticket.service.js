
const { getDataAPI } = require("./monday.service.js")
const config = require('../config/config.js')
const ticketsModel = require("../models/tickets.model")

let query = config.query
const url = config.url;
let access_token = config.mondayAccessToken
let query_cursor = config.query_cursor

const getQuery2 = async (cursor) => {
    let query_cursor2 = query_cursor.replace('${cursor}', cursor)
    return query_cursor2
}

const getValuesColumn = (item) => {
    try {

        const dataColumn = item.column_values
        const getColumnText = (id) => {
            const column = dataColumn.find(column => column.id === id)
            return column ? column : null
        }
        
        return {
            idTicket: getColumnText('id__de_elemento__1').text,
            ticketNumber: Number(getColumnText('id__de_elemento__1').text),
            subject: item.name,
            status: getColumnText('estado4__1').text,
            category: getColumnText('estado__1').text,
            webUrl: item.url,
            classification: getColumnText('estado0__1').text,
            methodofPayment: getColumnText('estado_12__1').text,
            area: getColumnText('estado_11__1').text,
            createdDate: getColumnText('fecha_1__1').text ? new Date(getColumnText('fecha_1__1').text) : null,
            closedTime: getColumnText('fecha3__1').text ? new Date(getColumnText('fecha3__1').text) : null,
            storeName: getColumnText('men__desplegable__1').text,
            agentName: getColumnText('personas__1').text,

        }


    } catch (e) {
        console.error("Error general ", e);
    }

}

const processItems = async (items) => {
    const bulkOperations = items.map((item) => {
        const ticketData = getValuesColumn(item);
        if (!ticketData || !ticketData.ticketNumber) return null;

        return {
            updateOne: {
                filter: { ticketNumber: ticketData.ticketNumber },
                update: { $set: ticketData },
                upsert: true
            }
        };

    }).filter(op => op !== null);  // Filtramos nulos
    if (bulkOperations.length > 0) {
        await ticketsModel.bulkWrite(bulkOperations);
        console.log(`✅ ${bulkOperations.length} tickets procesados en lote.`);
    }
};
const fetchPage = async (cursor = null) => {
    try {
        // console.log(`🔄 Obteniendo datos (cursor: ${cursor})`);
        const queryToUse = cursor ? await getQuery2(cursor) : query;
        const result = await getDataAPI(access_token, queryToUse, url);

        const items = result?.data?.boards?.[0]?.items_page?.items || result?.data?.next_items_page?.items || [];
        await processItems(items);

        return result?.data?.next_items_page?.cursor || result?.data?.boards?.[0]?.items_page?.cursor || null;
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        return null;
    }
};

const updateTicketsMonday2 = async () => {
    try {
        let cursor = await fetchPage(); // Primera página
        while (cursor) {
            cursor = await fetchPage(cursor);
        }
        console.log("✅ Sincronización completa.");
    } catch (error) {
        console.error("❌ Error en la sincronización:", error);
    }
};


module.exports = { updateTicketsMonday2 }