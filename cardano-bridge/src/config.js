const config = {
  port: 8080,
  appwrite: {
    url: process.env.APPWRITE_URL,
    project: process.env.APPWRITE_PROJECT,
    key: process.env.APPWRITE_KEY
  },
  cardano: {
    dir: process.env.CARDANO_STORE,
    network: process.env.CARDANO_NETWORK,
    shelleyGenesisPath: `${process.env.CARDANO_CONFIG}/testnet-shelley-genesis.json`,
    socketPath: process.env.CARDANO_NODE_SOCKET_PATH,
  }
}

module.exports = config