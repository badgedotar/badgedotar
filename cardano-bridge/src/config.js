const config = {
  port: 8080,
  prices: {
    base: 2,
    fee: 0.5,
    ret: 2,
  },
  appwrite: {
    url: process.env.APPWRITE_URL,
    project: process.env.APPWRITE_PROJECT,
    key: process.env.APPWRITE_KEY
  },
  ipfs: {
    key: process.env.IPFS_KEY,
    secret: process.env.IPFS_SECRET,
  },
  cardano: {
    dir: process.env.CARDANO_STORE,
    network: process.env.CARDANO_NETWORK,
    shelleyGenesisPath: `${process.env.CARDANO_CONFIG}/testnet-shelley-genesis.json`,
    socketPath: `${process.env.CARDANO_NODE_SOCKET_PATH}/node.socket`,
    collector: process.env.COLLECTOR_ADDRESS,
    explorer: 'https://explorer.cardano-testnet.iohkdev.io/en/transaction?id='
  }
}

console.log('Config', config)

module.exports = config