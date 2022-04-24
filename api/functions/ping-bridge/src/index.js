const sdk = require("node-appwrite");
const fetch = require("node-fetch");

const bridgeApi = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  console.log('Ping Cardano Bridge');

  const response = await fetch(bridgeApi)
  const data = await response.json()

  res.json(data);
};
