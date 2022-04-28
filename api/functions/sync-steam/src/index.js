const sdk = require("node-appwrite")
const SteamAPI = require('steamapi')
const get = require("async-get-file")

const dir = '/tmp/'
const client = new sdk.Client()
client
.setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
.setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
.setKey(process.env['APPWRITE_FUNCTION_API_KEY'])

const database = new sdk.Database(client)
const storage = new sdk.Storage(client)
const provider = 'steam'
const steam = new SteamAPI(process.env['STEAM_KEY'])

// module.exports = async function (req, res) {
//   const client = new sdk.Client();

//   // You can remove services you don't use
//   let account = new sdk.Account(client);
//   let avatars = new sdk.Avatars(client);
//   let database = new sdk.Database(client);
//   let functions = new sdk.Functions(client);
//   let health = new sdk.Health(client);
//   let locale = new sdk.Locale(client);
//   let storage = new sdk.Storage(client);
//   let teams = new sdk.Teams(client);
//   let users = new sdk.Users(client);

//   if (
//     !req.env['APPWRITE_FUNCTION_ENDPOINT'] ||
//     !req.env['APPWRITE_FUNCTION_API_KEY']
//   ) {
//     console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
//   } else {
//     client
//       .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
//       .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
//       .setKey(req.env['APPWRITE_FUNCTION_API_KEY'])
//       .setSelfSigned(true);
//   }

//   res.json({
//     areDevelopersAwesome: true,
//   });
// };

const test = async () => {
  const dir = '/tmp/'
  const provider = 'steam'
  const userId = '6264fff38bcc1251d6d7'
  const client = new sdk.Client()
  client
  .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
  .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
  .setKey(process.env['APPWRITE_FUNCTION_API_KEY'])

  let database = new sdk.Database(client)
  let storage = new sdk.Storage(client)

  const steam = new SteamAPI(process.env['STEAM_KEY'])

  const accounts = await database.listDocuments('accounts', [
    sdk.Query.equal('provider', provider),
    sdk.Query.equal('user', userId),
  ])

  const accountsDocs = accounts.documents
  const account =  accountsDocs[0]

  // // Update Name
  // const userSummary = await steam.getUserSummary(account.providerId)

  // await database.updateDocument('accounts', account.$id, {
  //   name: userSummary.nickname,
  // })

  // // Update Avatar
  // const avatarUrl = userSummary.avatar.large
  // const avatarTmpName = `accounts_${account.$id}.jpg`

  // const file = await get(avatarUrl, {
  //   directory: dir,
  //   filename: avatarTmpName,
  // })

  // const accountAvatar = await storage.createFile('accounts', account.$id, `${dir}${avatarTmpName}`, [
  //   `user:${userId}`
  // ], [])

  const games = await steam.getUserOwnedGames(account.providerId)

  for (let i = 0; i < games.length; i++) {
    // Update Game
    const game = games[i]
    const exist = await database.listDocuments('categories', [
      sdk.Query.equal('provider', provider),
      sdk.Query.equal('providerId', game.appID.toString()),
    ])
    if (exist.total === 0) {
      try {
        console.log(`Create ${game.name}`)
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

        const icon = await storage.createFile('categories', category.$id, `${dir}${iconTmpName}`)
        
        let shema
        try {
          shema = await steam.getGameSchema(game.appID)
        } catch (error) {
          console.log(error)
        }
        if (!shema) {
          continue;
        }
        const badges = (shema.availableGameStats && shema.availableGameStats.achievements) ? shema.availableGameStats.achievements : []

        // Update Badges
        for (let j = 0; j < badges.length; j++) {
          try {
            const badge = badges[j]
            const badgeDB = await database.createDocument('badges', 'unique()',{
              provider: provider,
              providerId: badge.name.toString(),
              category: game.appID.toString(),
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
      } catch (e) {
        console.log(`Fail ${game.name}`)
      }
    }
  }
}

const getUserBadges = async (providerId) => {
  const games = await steam.getUserOwnedGames(providerId)
  const playedGames = games.filter(game => game.playTime > 0)
  
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
      const badgeDB = await database.createDocument('generic-badges', 'unique()',{
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
  const categories = await database.listDocuments('generic-categories', [
    sdk.Query.equal('provider', 'provider'),
    sdk.Query.equal('providerId', game.appID.toString()),
  ])
  
  if (categories.total === 0) {
    const category = await database.createDocument('generic-categories', 'unique()',{
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
  const categories = await database.listDocuments('generic-badges', [
    sdk.Query.equal('provider', provider),
    sdk.Query.equal('providerId', providerId),
    sdk.Query.equal('category', category.$id),
  ])
  if (categories.total === 0) {
    return null
  }
  return categories.documents[0]
}

const test2 = async () => {
  const userId = '6264fff38bcc1251d6d7'
  const accountId = '62660b5e74e3afe9d4ed'
  
  const account = await getAccount(accountId)
  
  if (!account || account.user !== userId || account.provider !== provider) {
    return res.json({ error: 'Unauthorized' })
  } 

  const userBadges = await getUserBadges(account.providerId) 

  // for (let i = 0; i < badges.length; i++) {
    
  // }

  const userBadge = userBadges[0]
  const category = await getGame(userBadge.game)
  //const badge = await getBadge(category, userBadge.api)
  
  console.log(userBadge)
  //console.log(category)
  //console.log(badge)
}

test2()