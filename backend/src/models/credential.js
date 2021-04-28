const mongoose = require('mongoose')

const credentialShema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  consumer_key: { type: String, required: true },
  consumer_secret: { type: String, required: true },
  access_token_key: { type: String, required: true },
  access_token_secret: { type: String, required: true },
  bearer_token: { type: String, required: true },
})

const credential = mongoose.model('Credential', credentialShema)

module.exports = credential
