import * as openid from 'openid'
import { Query } from 'node-appwrite';
import { users, database } from "../appwrite"
import { steamConfig } from './config'

const handler = async (req, res) => {
  const userId = req.query.id
  let user, providerId, account

  try {
    user = await users.get(userId)
  } catch (e) {
    return res.status(400).json('user not valid')
  }

  const relyingParty = new openid.RelyingParty(
    `${steamConfig.base}${steamConfig.redirectPath}${user.$id}`,
    steamConfig.base,
    true,
    true,
    []
  )

  try {
    providerId = await new Promise((resolve, reject) => {
      relyingParty.verifyAssertion(req, (error, result) => {
        if (error) {
          return reject(error)
        }
        if (!result || !result.authenticated) {
          return reject("Failed to authenticate user.")
        }
        if (!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier)) {
          return reject("Claimed identity is not valid.");
        }

        const steamId = result.claimedIdentifier.replace(
          "https://steamcommunity.com/openid/id/",
          ""
        )

        resolve(steamId)
      })
    })
  } catch (e) {
    return res.status(500).json({ msg: e })
  }

  const accounts = await database.listDocuments('accounts', [
    Query.equal('provider', 'steam'),
    Query.equal('providerId', providerId),
  ])

  if (accounts.total) {
    return res.redirect(steamConfig.base)
  }

  try {
    account = await database.createDocument('accounts', 'unique()', {
      provider: 'steam',
      providerId: providerId,
      token: 'none',
      user: userId,
    }, [`user:${userId}`], [])
  } catch (e) {
    return res.status(500).json({ msg: e })
  }
  
  res.redirect(steamConfig.base)
}

export default handler