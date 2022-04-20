const CardanoCliJs = require('cardanocli-js')
const config = require('../config')

const cli = new CardanoCliJs(config.cardano)

const getTip = () => {
  return cli.queryTip()
}

module.exports = {
  getTip,
}