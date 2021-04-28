const express = require('express')
const { uid } = require('uid')
const CredentialModel = require('../models/credential')

const router = express.Router()

router.get('/', async (req, res) => {
  const credentials = await CredentialModel.find({})
  res.json(credentials)
})

router.post('/', async (req, res) => {
  const credentials = await CredentialModel.create({ id: uid(5), ...req.body })
  res.json(credentials)
})

router.delete('/', async (req, res) => {
  const credentials = await CredentialModel.deleteOne(req.body)
  res.json(credentials)
})

module.exports = router
