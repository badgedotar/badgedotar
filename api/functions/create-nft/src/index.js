const sdk = require("node-appwrite");
const fetch = require("node-fetch");
const { storeNFT } = require("./uploadNft");
const fs = require('fs');
const get = require("async-get-file")


const dotenv = require('dotenv');
dotenv.config()

const client = new sdk.Client()
client
.setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
.setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
.setKey(process.env['APPWRITE_FUNCTION_API_KEY'])

const database = new sdk.Database(client)
const storage = new sdk.Storage(client)

const handler = async function (req, res) {

  const payload = process.env.APPWRITE_FUNCTION_EVENT_DATA

  const userBadge = await database.getDocument('user-badges', payload);

  if(userBadge.minted) {
    res.json({
      message: 'Already minted'
    });
    res.status(400).end();
    return;
  }

  const badge = await database.getDocument('badges', userBadge.badge);
  
  const file = await storage.getFileView('badges', userBadge.badge);

  const filePath = `./tmp/${userBadge.badge}.jpg`
  fs.writeFileSync(filePath, file);

  const result = await storeNFT(filePath, badge.name, badge.description);

  const { ipnft, data } = result;
  const nftImageUrl = data.image.href;

  // TODO store minted user badge token en database
  console.log({
    ipnft,
    nftImageUrl
  });
  
  // try {
  //   const user = JSON.parse(payload)
  //   if (user.$id) {
  //     const response = await fetch(`${bridgeApi}/user/${user.$id}/wallet`)
  //     const wallet = await response.json()
  //     return res.json(wallet);
  //   } 
  // } catch(e) {
  //   return res.json(e)
  // }
};

handler({}, {});

module.exports = handler