import * as openid from 'openid'
import { users } from "../appwrite"
import { steamConfig } from './config'

const handler = async (req, res) => {
  const userId = req.query.id
  let user, url

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
    url = await new Promise((resolve, reject) => {
      relyingParty.authenticate(steam, false, (error, authUrl) => {
        if (error) return reject("Authentication failed: " + error)
        if (!authUrl) return reject("Authentication failed.")
        resolve(authUrl)
      })
    })
  } catch (e) {
    return res.status(400).json({ msg: e })
  }

  res.redirect(url)
}

export default handler