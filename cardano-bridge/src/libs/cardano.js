const CardanoCliJs = require('cardanocli-js')
const config = require('../config')

const cli = new CardanoCliJs(config.cardano)

const getTip = () => {
  return cli.queryTip()
}

const getWallet = (name) => {
  try {
    const mainPaymentKey = cli.addressKeyGen(name)
    const adress = cli.addressBuild(name, {
      paymentVkey: mainPaymentKey.vkey
    })
  }
  finally {
    const wallet = cli.wallet(name)
    return wallet
  }
}

module.exports = {
  getTip,
  getWallet,
}