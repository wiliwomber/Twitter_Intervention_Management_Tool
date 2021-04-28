const express = require('express')
const TweetModel = require('../models/tweet')

const router = express.Router()

router.get('/', async (req, res) => {
  const tweets = await TweetModel.find({})
  res.json(tweets)
})

router.put('/', async (req, res) => {
  const { id } = req.body
  await TweetModel.updateOne({ id }, req.body )
  const updatedTweet = await TweetModel.findOne({ id })
  res.json(updatedTweet)
})

module.exports = router
