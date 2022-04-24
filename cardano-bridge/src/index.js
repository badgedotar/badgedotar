const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')
const cardano = require('./libs/cardano')
const appwrite = require('./libs/appwrite')


app.use(cors())

app.get('/', (req, res) => {
  return res.json({
    name: 'Badge.ar - Cardano Bridge',
    version: '0.0.1',
  })
})

app.get('/cardano/tip', (req, res) => {
  return res.json(cardano.getTip())
})

app.get('/user/:userId/wallet', async (req, res) => {
  const userId = req.params.userId
  let user, wallet, dbWallet
  try {
    user = await appwrite.users.get(userId)
  } catch (e) {
    return res.status(400).json('user not valid')
  }
  wallet = await cardano.getWallet(userId)
  try {
    dbWallet = await appwrite.database.getDocument('wallets', userId)
  } catch (e) {
    dbWallet = await appwrite.database.createDocument('wallets', userId, {
      address: wallet.paymentAddr,
      balance: 0,
    }, [`user:${userId}`], [])
  }
  return res.json(dbWallet)
})

app.get('/sync/wallets', async (req, res) => {
  const query = await appwrite.database.listDocuments('wallets')
  const dbWallets = query.documents

  const promises = dbWallets.map(async (dbWallet) => {
    const wallet = await cardano.getWallet(dbWallet.$id)
    const balance = wallet.balance()
    const lovelace = balance.value.lovelace ?? 0
    const updated = appwrite.database.updateDocument('wallets', dbWallet.$id, {
      balance: lovelace,
    })
    return updated
  })
  
  const results = await Promise.all(promises)

  return res.json('ok')
})


app.listen(config.port, () => {
  console.log(`App listening at http://0.0.0.0:${config.port}`)
})