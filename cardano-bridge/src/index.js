const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')
const cardano = require('./libs/cardano')
const appwrite = require('./libs/appwrite')
const ipfs = require('./libs/ipfs')

app.use(cors())

app.get('/', (req, res) => {
  return res.json({
    name: 'Badge.ar - Cardano Bridge',
    version: '0.0.2',
    prices: {
      base: config.prices.base,
      fee: config.prices.fee,
    }
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

  return res.json({msg: 'ok'})
})

app.get('/sync/orders', async (req, res) => {
  const query = await appwrite.database.listDocuments('orders', [
    appwrite.Query.equal('status', 'new')
  ])
  const dbOrders = query.documents

  for (let index = 0; index < dbOrders.length; index++) {
    try {
      const order = dbOrders[index];
      console.log('Minting order', order.$id)

      const wallet = await cardano.getWallet(order.user)
      const balance = wallet.balance()
      const lovelace = balance.value.lovelace ?? 0

      const dbUserBadges = await Promise.all(order.userBadges.map((id) => {
        return appwrite.getDBUserBadge(id)
      }))
      
      const badges = dbUserBadges.filter((badge) => {
        if (badge.user.minted) {
          return false
        }
        if (badge.user.user !== order.user) {
          return false
        }
        return true
      })

      if (badges.length === 0) {
        await appwrite.database.updateDocument('orders', order.$id, {
          status: 'failed',
          msg: 'No valid Badges'
        })
        continue
      }

      const policyWallet = cardano.getPolicyWallet()
      const policyMintScript = cardano.getPolicyMintScript(policyWallet)
      const policyId = cardano.getPolicyId(policyMintScript)

      const base = cardano.toLovelace(config.prices.base)
      const fee = cardano.toLovelace(badges.length * config.prices.fee)
      const ret = cardano.toLovelace(config.prices.ret)
      const cost = base + fee + ret
      const rest = lovelace - cost

      if (lovelace < cost) {
        await appwrite.database.updateDocument('orders', order.$id, {
          status: 'failed',
          msg: 'not enough funds'
        })
        continue
      }
      
      const images = await Promise.all(badges.map((badge) => {
        return ipfs.upload(badge)
      }))

      const metadata = {
        721: {
          [policyId]: {
            ...badges.reduce((assets, badge, index) => {
              const id = badge.user.$id
              const name = `${badge.category.name} - ${badge.badge.name}`
              assets[id] = {
                BADGE: badge.badge.$id,
                CATEGORY: badge.category.$id,
                PROVIDER: badge.category.provider,
                files: [
                  {
                    mediaType: 'image/jpeg',
                    name: name,
                    src: images[index],
                  }
                ],
                image: images[index],
                name: name,
                project: "Badge.ar",
              }
              return assets
            }, {})
          }
        }
      }

      const tokenNames = cardano.getTokenNames(policyId, badges.map((badge) => { return badge.user.$id }))
      const tokenAmounts = tokenNames.reduce((amounts, name) => {
        amounts[name] = 1
        return amounts
      }, {})

      const mint = tokenNames.map((name) => {
        return {
          action: 'mint',
          quantity: 1,
          asset: name,
          script: policyMintScript
        }
      })

      const tx = {
        txIn: balance.utxo,
        txOut: [
          {
            address: config.cardano.collector,
            value: { lovelace: base + fee }
          },
          {
            address: order.address,
            value: { lovelace: ret, ...tokenAmounts },
          },
          {
            address: wallet.paymentAddr,
            value: { 
              ...balance.value,
              lovelace: rest
            }
          }
        ],
        mint,
        metadata,
        witnessCount: 5,
      }

      const raw = cardano.createTransaction(tx)
      const signed = cardano.signTransaction(raw, wallet, policyWallet)
      const txHash = cardano.transactionSubmit(signed)

      await Promise.all(badges.map(async (badge) => {
        return appwrite.database.updateDocument('user-badges', badge.user.$id, {
          minted: true,
        })
      }))

      await appwrite.database.updateDocument('orders', order.$id, {
        minted: true,
        status: 'completed',
        msg: `${config.cardano.explorer}${txHash}`
      })
    } catch (e) {
      console.log('FAIL', e)
      await appwrite.database.updateDocument('orders', order.$id, {
        status: 'failed',
        msg: 'Failed to mint badges'
      })
    }
  }
  return res.json({msg: 'ok'})
})

app.listen(config.port, () => {
  console.log(`App listening at http://0.0.0.0:${config.port}`)
})