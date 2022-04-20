const sdk = require('node-appwrite');

const client = new sdk.Client();
client.setEndpoint(process.env.APPWRITE_URL);
client.setProject(process.env.APPWRITE_PROJECT);
client.setKey(process.env.APPWRITE_KEY);

export const database = new sdk.Database(client);