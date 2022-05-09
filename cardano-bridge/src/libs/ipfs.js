const fs = require('fs');
const config = require('../config')
const appwrite = require('./appwrite')
const pinataSDK = require('@pinata/sdk');

const pinata = pinataSDK(config.ipfs.key, config.ipfs.secret);

const upload = async (badge) => {
  const id = badge.badge.$id
  const content = await appwrite.storage.getFileView('badges', id)
  
  const filePath = `/tmp/${id}.jpg`
  await fs.promises.writeFile(filePath, file)

  const readableStreamForFile = fs.createReadStream(filePath)

  const upload = await pinata.pinFileToIPFS(readableStreamForFile, {
    pinataMetadata: {
      name: `${id}.jpg`,
    },
    pinataOptions: {
      cidVersion: 0,
    }
  })

  return `ipfs://${upload.IpfsHash}`
}

module.exports = {
  upload,
}