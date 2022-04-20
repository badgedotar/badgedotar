const sdk = require('node-appwrite');
const config = require('../config');

const client = new sdk.Client()
client.setEndpoint(config.appwrite.url)
client.setProject(config.appwrite.project)
client.setKey(config.appwrite.key);

const database = new sdk.Database(client);
const users = new sdk.Users(client);

module.exports = {
  database,
  users,
}