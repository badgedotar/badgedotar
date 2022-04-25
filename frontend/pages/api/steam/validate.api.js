import { users } from "../appwrite"
import * as openid from 'openid'
import { get } from 'axios'
import { steamConfig } from './config'

const handler = async (req, res) => {
  const userId = req.query.id
  let user, providerId

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

  res.status(200).json({ providerId })
}

export default handler