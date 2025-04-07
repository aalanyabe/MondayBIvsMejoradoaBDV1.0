
const { getDataAPI } = require("./monday.service.js")
const config = require('../config/config.js')
const storeModel = require("../models/store.model")

let query = config.querystore
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
            storeNumber: getColumnText('storenro__1').text,
            storeName: item.name,
            supervisor: getColumnText('texto3__1').text,
            zonalSupervisor: getColumnText('dup__of_supervisora_mkn4vzcc').text,
        }

    } catch (e) {
        console.error("Error general ", e);
    }

}

const processItems = async (items) => {
    try {
        // console.log("items: ", items)
        const bulkOperations = items.map((item) => {
            const storeData = getValuesColumn(item);
            console.log("storeData: ", storeData)
            if (!storeData || !storeData.storeNumber) return null;

            return {
                updateOne: {
                    filter: { storeNumber: storeData.storeNumber },
                    update: { $set: storeData },
                    upsert: true
                }

            };
        }).filter(op => op !== null);  // Filtramos nulos
        if (bulkOperations.length > 0) {
            console.log("bulkoperation: ", bulkOperations.length)
            console.log("bulkoperation: ", bulkOperations)
            try {
                await storeModel.bulkWrite(bulkOperations);
                console.log(`✅ ${bulkOperations.length} tiendas procesadas en lote.`);
            } catch (error) {
                console.error("❌ Error en bulkWrite de tiendas:", error);
            }
            
        }

    } catch {
        console.error("❌ Error en processItems:", error);
    }

};

const fetchAndProcessAllItems = async () => {
    let allItems = [];
    let cursor = null;

    do {
        const queryToUse = cursor ? await getQuery2(cursor) : query;
        console.log("querytouse: ", queryToUse)
        const result = await getDataAPI(access_token, queryToUse, url);
        const items = result?.data?.boards?.[0]?.items_page?.items || result?.data?.next_items_page?.items || [];
        console.log("longitud de item: ", items.length)

        allItems.push(...items); // Acumulamos los items en un solo array

        cursor = result?.data?.next_items_page?.cursor || result?.data?.boards?.[0]?.items_page?.cursor || null; // Obtener el siguiente cursor

    } while (cursor); // Continuar hasta que no haya más datos
    // console.log("los items ", allItems)
    // Solo una ejecución de bulkWrite con todos los items
    if (allItems.length > 0) {
        console.log("entro en esta condicion...")
        await processItems(allItems);
        console.log("entro en esta condicion2...")
        console.log(`✅ Se procesaron ${allItems.length} tickets en un solo lote.`);
    } else {
        console.log("⚠️ No hay tickets para procesar.");
    }
};


module.exports = { fetchAndProcessAllItems }