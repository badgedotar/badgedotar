const sdk = require('node-appwrite')
const config = require('../config')

const client = new sdk.Client()
client.setEndpoint(config.appwrite.url)
client.setProject(config.appwrite.project)
client.setKey(config.appwrite.key)

const database = new sdk.Database(client)
const users = new sdk.Users(client)
const storage = new sdk.Storage(client)

const getDBUserBadge = async (id) => {
  try {
    const user = await database.getDocument('user-badges', id)
    const badge = await database.getDocument('badges', user.badge)
    const category = await database.getDocument('categories', badge.category)
    return {
      user,
      badge,
      category,
    }
  } catch (e) {
    console.log(e)
    return undefined
  }
}

module.exports = {
  database,
  users,
  storage,
  Query: sdk.Query,
  getDBUserBadge,
}