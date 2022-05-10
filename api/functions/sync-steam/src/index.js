const sdk = require("node-appwrite")
const SteamAPI = require('steamapi')
const get = require("async-get-file")

module.exports = async function (req, res) {
  const provider = 'steam'
  const dir = '/tmp/'
  const client = new sdk.Client();
  let database = new sdk.Database(client);
  let storage = new sdk.Storage(client);

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
  const steam = new SteamAPI(process.env['STEAM_KEY'])

  const getSteamUserBadges = async (providerId, gameId = undefined) => {
    const games = await steam.getUserOwnedGames(providerId)
    let playedGames = []
    if (gameId) {
      const appId = parseInt(gameId)
      playedGames = games.filter(game => game.appID === appId)
    } else {
      playedGames = games.filter(game => game.playTime > 0)
    }
    const gameBadges = await Promise.all(playedGames.map(async game => {
      try {
        const badges = await steam.getUserAchievements(providerId, game.appID)
        const achieved = badges.achievements.filter(badge => badge.achieved)
        return achieved.map(badge => ({...badge, game: game }))
      } catch (e) {
        return []
      }
    }))
    const badges = gameBadges.flatMap((gb) => gb)
    return badges
  }
  
  const getAccount = async (accountId) => {
    try {
      const account = await database.getDocument('accounts', accountId)
      return account
    } catch (e) {
      return null
    }
  }
  
  const createBadges = async (category) => {
    let shema
    try {
      shema = await steam.getGameSchema(parseInt(category.providerId))
    } catch (error) {
      return
    }
    if (!shema) {
      return
    }
    const badges = (shema.availableGameStats && shema.availableGameStats.achievements) ? shema.availableGameStats.achievements : []
    for (let j = 0; j < badges.length; j++) {
      try {
        const badge = badges[j]
        const badgeDB = await database.createDocument('badges', 'unique()',{
          provider: provider,
          providerId: badge.name.toString(),
          category: category.$id,
          name: badge.displayName || badge.name.toString(),
          description: badge.description || '',
        })
        const iconUrl = badge.icon
        const iconTmpName = `badge_${badgeDB.$id}.jpg`
        try {
          const file = await get(iconUrl, {
            directory: dir,
            filename: iconTmpName,
          })
          const icon = await storage.createFile('badges', badgeDB.$id, `${dir}${iconTmpName}`)
        } catch (error) {
          // No Image
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  const getGame = async (game) => {
    const categories = await database.listDocuments('categories', [
      sdk.Query.equal('provider', provider),
      sdk.Query.equal('providerId', game.appID.toString()),
    ])
    if (categories.total === 0) {
      const category = await database.createDocument('categories', 'unique()',{
        provider: provider,
        providerId: game.appID.toString(),
        name: game.name,
      })
      const iconUrl = game.iconURL
      const iconTmpName = `category_${category.$id}.jpg`
      const file = await get(iconUrl, {
        directory: dir,
        filename: iconTmpName,
      })
      await storage.createFile('categories', category.$id, `${dir}${iconTmpName}`)
      await createBadges(category)
      return category
    }
    return categories.documents[0]
  }
  
  const getBadge = async (category, providerId) => {
    const categories = await database.listDocuments('badges', [
      sdk.Query.equal('provider', provider),
      sdk.Query.equal('providerId', providerId),
      sdk.Query.equal('category', category.$id),
    ])
    if (categories.total === 0) {
      return null
    }
    return categories.documents[0]
  }
  
  const getUserBadge = async (badge, account) => {
    const userBadges = await database.listDocuments('user-badges', [
      sdk.Query.equal('badge', badge.$id),
      sdk.Query.equal('account', account.$id),
    ])
    if (userBadges.total === 0) {
      const userBadge = await database.createDocument('user-badges', 'unique()',{
        badge: badge.$id,
        account: account.$id,
        user: account.user,
        minted: false,
      }, [`user:${account.user}`], [])
      return userBadge
    }
    return userBadges.documents[0]
  }

  let userId = req.env['APPWRITE_FUNCTION_USER_ID']

  let payload
  try {
    payload = JSON.parse(req.payload)
  } catch (e) {
    return res.json("Payload are required");
  }
  const { accountId, gameId } = payload

  // Admin Map
  if (userId === '626afd87e6bb93e73a63') {
    userId = payload.userId || userId
  }

  const account = await getAccount(accountId)
  if (!account || account.user !== userId || account.provider !== provider) {
    return res.json({ error: 'Unauthorized' });
  }

  let steamUserBadges = []
  try {
    steamUserBadges = await getSteamUserBadges(account.providerId, gameId);
  } catch (e) {
    return res.json({ error: 'Private Profile' })
  }

  const out = []
  for (let i = 0; i < steamUserBadges.length; i++) {
    try {
      const steamUserBadge = steamUserBadges[i]
      out.push(`${steamUserBadge.game.name} - ${steamUserBadge.name}`)
      const category = await getGame(steamUserBadge.game)
      const badge = await getBadge(category, steamUserBadge.api)
      const userBadge = await getUserBadge(badge, account)    
    } catch (error) {
      // Fail to Get Games
    }
  }

  return res.json({
    msg: `Success`,
    badges: out,
  })
};
