const sdk = require("node-appwrite");
const SteamAPI = require('steamapi')
const get = require("async-get-file")

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const database = new sdk.Database(client);
  const storage = new sdk.Storage(client);

  if (
    !req.env['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.env['APPWRITE_FUNCTION_API_KEY'] ||
    !req.env['STEAM_KEY']
  ) {
    return res.json("Environment variables are not set.");
  } else {
    client
      .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.env['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  let payload
  try {
    payload = JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA)
  } catch (e) {
    return res.json("This is only for new steam accounts");
  }
  
  if (process.env.APPWRITE_FUNCTION_EVENT !== 'database.documents.create' || payload.$collection !== 'accounts') {
    return res.json("This is only for new steam accounts");
  }

  try {
    const account = await database.getDocument('accounts', payload.$id)
    
    if (!account || account.provider !== 'steam') {
      return res.json("This is only for new steam accounts");
    }

    // Init Steam
    const steam = new SteamAPI(req.env['STEAM_KEY'])

    // Get Steam Summary
    const userSummary = await steam.getUserSummary(parseInt(account.providerId))

    // Update Account
    await database.updateDocument('accounts', account.$id, {
      name: userSummary.nickname,
    })

    // Update Avatar
    const avatarUrl = userSummary.avatar.large
    const avatarTmpName = `accounts_${account.$id}.jpg`

    const file = await get(avatarUrl, {
      directory: '/tmp/',
      filename: avatarTmpName,
    })

    const accountAvatar = await storage.createFile('accounts', account.$id, `/tmp/${avatarTmpName}`, [
      `user:${account.user}`
    ], [])

    return res.json({
      msg: "Success",
      account,
      accountAvatar,
    });
  } catch (e) {
    return res.json({
      msg: "This is only for new steam accounts",
      error: e,
    });
  }
};
