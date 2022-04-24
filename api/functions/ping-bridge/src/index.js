const sdk = require("node-appwrite");
const fetch = require("node-fetch");

const bridge = 'http://api.badge.ar:8080';

module.exports = async function (req, res) {
  console.log('Ping Cardano Bridge');

  const bridge = await fetch(bridge)

  console.log(bridge)

  res.send(bridge);
};
