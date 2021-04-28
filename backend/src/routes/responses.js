const express = require('express')
const { uid } = require('uid')
const ResponseModel = require('../models/response')

const router = express.Router()

router.get('/', async (req, res) => {
  const responses = await ResponseModel.find({})
  res.json(responses)
})

router.post('/', async (req, res) => {
  const responses = await ResponseModel.create({ id: uid(5), ...req.body })
  res.json(responses)
})

router.delete('/', async (req, res) => {
  const responses = await ResponseModel.deleteOne(req.body)
  res.json(responses)
})

module.exports = router
