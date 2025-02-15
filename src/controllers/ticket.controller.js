const { updateTicketsMonday, updateTicketsMonday2,fetchAndProcessAllItems } = require("../service/ticket.service.js")

const syncTickets = async (req, res) => {
  try {
    await fetchAndProcessAllItems()
    return { message: "Tickets sincronizados correctamente" };
  } catch (error) {
    return { error: "Error sincronizando tickets" }
  }
};

module.exports = { syncTickets };
