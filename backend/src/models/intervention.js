const mongoose = require('mongoose')

const interventionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  project_id: { type: String, required: true },
  original_tweet: { type: Object, required: true },
  response_tweet: { type: Object, required: true },
})

const intervention = mongoose.model('Intervention', interventionSchema)

module.exports = intervention
