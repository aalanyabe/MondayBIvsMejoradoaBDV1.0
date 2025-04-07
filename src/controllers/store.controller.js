const {fetchAndProcessAllItems } = require("../service/store.service.js")

const syncStore = async (req, res) => {
  try {
    await fetchAndProcessAllItems()
    return { message: "Stores sincronizados correctamente" };
  } catch (error) {
    return { error: "Error sincronizando Stores" }
  }
};

module.exports = { syncStore };
