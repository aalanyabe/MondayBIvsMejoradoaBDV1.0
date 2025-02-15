const { updateTicketsMonday, updateTicketsMonday2 } = require("../service/ticket.service.js")

const syncTickets = async (req, res) => {
  try {
    await updateTicketsMonday2()
    return { message: "Tickets sincronizados correctamente" };
  } catch (error) {
    return { error: "Error sincronizando tickets" }
  }
};

module.exports = { syncTickets };
