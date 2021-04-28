const mongoose = require('mongoose')

const responseShema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  credential_id: { type: String, required: true },
  credential_name: { type: String, required: true },
})

const response = mongoose.model('Response', responseShema)

module.exports = response
