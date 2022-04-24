const fetch = require("node-fetch");
const sdk = require("node-appwrite");

const bridge = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  if (APPWRITE_FUNCTION_EVENT !== "account.create") {
    return res.status(500).json("This is only for new accounts");
  }

  const payload = APPWRITE_FUNCTION_EVENT_DATA
  try {
    const user = JSON.parse(payload)
    if (user.$id) {
      const wallet = await fetch(`${bridge}/user/${user.$id}/wallet`)
      return res.json(wallet);
    } 
  } catch(e) {
    return res.status(500).json(e)
  }
};
