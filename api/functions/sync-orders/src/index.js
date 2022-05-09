const sdk = require("node-appwrite");
const fetch = require("node-fetch");

const bridgeApi = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  console.log('Sync Orders');

  const response = await fetch(`${bridgeApi}/sync/orders`);
  const data = await response.json()

  res.json(data);
};
