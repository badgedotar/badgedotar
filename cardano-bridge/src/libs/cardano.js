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

const getPolicyWallet = () => {
  const policyWallet = getWallet(config.appwrite.project)
  return policyWallet
}

const getPolicyMintScript = (policyWallet) => {
  return {
    'type': 'sig',
    'keyHash': cli.addressKeyHash(policyWallet.name)
  }
}

const getPolicyId = (policyMintScript) => {
  return cli.transactionPolicyid(policyMintScript)
}

const getTokenNames = (policyId, names) => {
  return names.map((name) => `${policyId}.${name}`)
}

const createTransaction = (tx) => {
  let raw = cli.transactionBuildRaw(tx)
  let fee = cli.transactionCalculateMinFee({
    ...tx,
    txBody: raw,
  });
  tx.txOut[0].value.lovelace -= fee
  return cli.transactionBuildRaw({ ...tx, fee })
}

const signTransaction = (tx, wallet, policyWallet) => {
  return cli.transactionSign({
    signingKeys: [wallet.payment.skey, policyWallet.payment.skey],
    txBody: tx,
  });
}

const transactionSubmit = (tx) => {
  return cli.transactionSubmit(tx)
}


module.exports = {
  getTip,
  getWallet,
  getPolicyWallet,
  getPolicyMintScript,
  getPolicyId,
  getTokenNames,
  toLovelace: cli.toLovelace,
  createTransaction,
  signTransaction,
  transactionSubmit,
}