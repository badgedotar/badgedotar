const fetch = require("node-fetch");

const bridgeApi = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  if (process.env.APPWRITE_FUNCTION_EVENT !== "users.create" && process.env.APPWRITE_FUNCTION_EVENT !== "account.create") {
    return res.json("This is only for new users");
  }

  const payload = process.env.APPWRITE_FUNCTION_EVENT_DATA
  try {
    const user = JSON.parse(payload)
    if (user.$id) {
      const response = await fetch(`${bridgeApi}/user/${user.$id}/wallet`)
      const wallet = await response.json()
      return res.json(wallet);
    } 
  } catch(e) {
    return res.json(e)
  }
};
