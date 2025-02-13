const { updateTicketsMonday } = require("../service/ticket.service.js")

const syncTickets = async (req, res) => {
  try {
    await updateTicketsMonday()
    return { message: "Tickets sincronizados correctamente" };
  } catch (error) {
    return { error: "Error sincronizando tickets" }
  }
};

module.exports = { syncTickets };
