const express = require('express')
const { uid } = require('uid')

const ProjectModel = require('../models/project')
const ResponseModel = require('../models/response')
const CredentialModel = require('../models/credential')
const TweetModel = require('../models/tweet')
const InterventionModel = require('../models/intervention')
const ExportService = require('../services/ExportService')
const RequestService = require('../services/RequestService')

const router = express.Router()

router.get('/', async (req, res) => {
  const projects = await ProjectModel.find({})
  res.json(projects)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const project = await ProjectModel.find({ id })
  res.json(project)
})

router.post('/', async (req, res) => {
  const projectData = req.body
  projectData.id = uid(5)
  const project = await ProjectModel.create(projectData)
  res.json(project)
})

router.get('/start/:id', async (req, res) => {
  const { id } = req.params
  const project = await ProjectModel.findOne({ id })
  const credentials = await CredentialModel.findOne({
    id: project.query.credentials,
  })
  const occupyingProjects = await ProjectModel.find({
    running: true,
    id: { $ne: project.id },
    'query.credentials': project.query.credentials,
  })
  if (occupyingProjects.length) {
    res.status(404).send({
      error: `Project: ${occupyingProjects[0].name}, is using the same credentials and is already running. Please stop that project first.`,
    })
    return
  }
  const { data } = await RequestService.addRule(
    project.query.q,
    project.name,
    credentials
  )
  if (data.errors) {
    console.log(data.errors)
    res
      .status(501)
      .send({ error: 'An error occurred while adding query to Twitter.' })
    return
  }
  const createdRules = data.data
  RequestService.startFetchingTweets({ id, credentials, rules: createdRules })
  await ProjectModel.updateOne(
    { id },
    { 'query.rules': createdRules, running: true }
  )
  const updatedProject = await ProjectModel.findOne({ id })
  res.json(updatedProject)
})

router.get('/stop/:id', async (req, res) => {
  const { id } = req.params
  RequestService.stopFetchingTweets(id)
  const project = await ProjectModel.findOne({ id })
  const credentials = await CredentialModel.findOne({
    id: project.query.credentials,
  })
  const { rules } = project.query
  if (!rules.length) {
    return res.status(404)
  }
  const ruleId = rules[0].id
  const { data } = await RequestService.deleteRule(ruleId, credentials)
  if (data.errors) {
    console.log(data.errors)
    return res.status(501)
  }
  await ProjectModel.updateOne({ id }, { 'query.rules': [], running: false })
  const updatedProject = await ProjectModel.findOne({ id })
  res.json(updatedProject)
})

router.post('/testRules/:id', async (req, res) => {
  const { query, credentialId } = req.body
  const credentials = await CredentialModel.findOne({ id: credentialId })
  const { data } = await RequestService.addRule(query, 'testRule', credentials)
  if (data.errors) {
    console.log('Error while creating test rule: ', data.errors)
    res.status(501).send({ error: data.errors })
    return
  }
  const createdRules = data.data
  const ruleId = createdRules[0].id
  await RequestService.deleteRule(ruleId, credentials)
  res.status(200).send({ valid: 'Valid rule' })
})

router.get('/export/:id', async (req, res) => {
  const { id } = req.params
  const { target } = req.query
  const { name } = await ProjectModel.findOne({ id })
  const data =
    target === 'tweets'
      ? await TweetModel.find({ project_id: id }).lean()
      : await InterventionModel.find({ project_id: id }).lean()
  const csv = await ExportService.exportData(data)
  res.attachment(`${name}.csv`)
  res.status(200).send(csv)
})

router.delete('/reset', async (req, res) => {
  const credentials = await CredentialModel.find({})
  await RequestService.resetStreams(credentials[0])
  res.status(200).send({ message: 'All projects resetted' })
})

router.put('/', async (req, res) => {
  const { id } = req.body
  await ProjectModel.updateOne({ id }, req.body)
  const updatedProject = await ProjectModel.findOne({ id })
  res.json(updatedProject)
})

router.delete('/', async (req, res) => {
  const project = await ProjectModel.deleteOne(req.body)
  const projectId = req.body.id
  await TweetModel.deleteMany({ project_id: projectId })
  await InterventionModel.deleteMany({ project_id: projectId })
  res.json(project)
})

router.post('/intervene', async (req, res) => {
  const { tweetId, userName, responseId, projectId } = req.body
  const project = await ProjectModel.findOne({ id: projectId })
  const interventionFields = project.data_fields.on_intervention.query
  const { text, credential_id } = await ResponseModel.findOne({
    id: responseId,
  })

  const credentials = await CredentialModel.findOne({ id: credential_id })

  const tweet = await RequestService.getTweetById({
    id: tweetId,
    fields: interventionFields,
    credentials,
  })

  const response = await RequestService.replyToTweet({
    userName,
    tweetId,
    text,
    credentials,
  })

  await InterventionModel.create({
    id: uid(6),
    project_id: projectId,
    original_tweet: tweet,
    response_tweet: response,
  })
  res.status(200).send({ message: 'Created Intervention' })
})

module.exports = router
