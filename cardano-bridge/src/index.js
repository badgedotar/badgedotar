const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')
const cardano = require('./libs/cardano')

app.use(cors())

app.get('/', (req, res) => {
  return res.send('Badge.ar - Cardano Bridge')
})

app.get('/cardano/tip', (req, res) => {
  return res.json(cardano.getTip())
})

app.listen(config.port, () => {
  console.log(`App listening at http://0.0.0.0:${config.port}`)
})