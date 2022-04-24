const fetch = require("node-fetch");
const sdk = require("node-appwrite");

const bridgeApi = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  if (APPWRITE_FUNCTION_EVENT !== "account.create") {
    return res.status(500).json("This is only for new accounts");
  }

  const payload = APPWRITE_FUNCTION_EVENT_DATA
  try {
    const user = JSON.parse(payload)
    if (user.$id) {
      const response = await fetch(`${bridgeApi}/user/${user.$id}/wallet`)
      const wallet = await response.json()
      return res.json(wallet);
    } 
  } catch(e) {
    return res.status(500).json(e)
  }
};
