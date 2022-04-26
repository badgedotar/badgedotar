import * as sdk from 'node-appwrite';

const appwriteConfig = {
  url: process.env.APPWRITE_URL,
  project: process.env.APPWRITE_PROJECT,
  key: process.env.APPWRITE_KEY
}

export const client = new sdk.Client()
client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.project)
client.setKey(appwriteConfig.key);

export const database = new sdk.Database(client);
export const users = new sdk.Users(client);