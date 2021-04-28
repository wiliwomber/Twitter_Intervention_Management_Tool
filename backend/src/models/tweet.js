const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  project_id: { type: String, required: true },
  has_intervention: { type: Boolean, required: false },
  tweet_data: { type: Object, required: true },
})

const tweet = mongoose.model('Tweet', tweetSchema)

module.exports = tweet
