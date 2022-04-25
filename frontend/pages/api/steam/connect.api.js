import { users } from "../appwrite"

const handler = async (req, res) => {
  const userId = req.query.id
  let user

  try {
    user = await users.get(userId)
  } catch (e) {
    return res.status(400).json('user not valid')
  }

  res.status(200).json(user)
}

export default handler