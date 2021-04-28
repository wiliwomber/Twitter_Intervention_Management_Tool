const Twitter = require('twitter-v2')
const Twit = require('twit')
const axios = require('axios')
const request = require('request')
const TweetModel = require('../models/tweet')
const ProjectModel = require('../models/project')
const CredentialModel = require('../models/credential')

const streams = []

const addRule = (value, tag, credentials) => {
  return axios.post(
    'https://api.twitter.com/2/tweets/search/stream/rules',
    {
      add: [{ value, tag }],
    },
    {
      headers: {
        Authorization: `Bearer ${credentials.bearer_token}`,
      },
    }
  )
}

const deleteRule = (id, credentials) => {
  return axios.post(
    'https://api.twitter.com/2/tweets/search/stream/rules',
    {
      delete: { ids: [id] },
    },
    {
      headers: {
        Authorization: `Bearer ${credentials.bearer_token}`,
      },
    }
  )
}

const getTweetById = async ({ id, fields = '', credentials }) => {
  const { data } = await axios.get(
    `https://api.twitter.com/2/tweets?ids=${id}${fields}`,
    {
      headers: {
        Authorization: `Bearer ${credentials.bearer_token}`,
      },
    }
  )
  return data.data[0]
}

const replyToTweet = async ({ userName, tweetId, text, credentials }) => {
  const credentialsInV1Format = {
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret,
  }
  const twitter = new Twit(credentialsInV1Format)
  const { err, data } = await twitter.post('statuses/update', {
    in_reply_to_status_id: tweetId,
    status: `@${userName} ${text}`,
  })
  if (err) return err
  const reply = JSON.parse(JSON.stringify(data))
  return reply
}

const getConversationId = async (tweetId, credentials) => {
  const twitter = new Twitter(credentials)
  const { data, errors } = await twitter.get('tweets', {
    ids: tweetId,
    'tweet.fields': 'conversation_id',
  })
  if (data && data.length) {
    const { conversation_id } = data[0]
    return conversation_id
  }
  return errors
}

const stopFetchingTweets = (id) => {
  const stopStream = streams[id]
  if (stopStream) {
    stopStream()
  }
}

const abortFechtingTweets = async ({ projectId, error }) => {
  stopFetchingTweets(projectId)
  const project = await ProjectModel.findOne({ id: projectId })
  const credentials = await CredentialModel.findOne({
    id: project.query.credentials,
  })
  const { rules } = project.query
  if (!rules.length) {
    console.log('no rules found')
  }
  const ruleId = rules[0].id
  const { data } = await deleteRule(ruleId, credentials)
  if (data.errors) {
    console.log('error while aborting: ', data.errors)
  }
  await ProjectModel.updateOne(
    { id: projectId },
    { 'query.rules': [], running: false }
  )
}

const startFetchingTweets = async ({ id: projectId, rules, credentials }) => {
  const stream = request.get({
    url:
      'https://api.twitter.com/2/tweets/search/stream?tweet.fields=created_at&expansions=author_id&user.fields=description,profile_image_url',
    auth: {
      bearer: credentials.bearer_token,
    },
  })
  const closeStream = () => stream.abort()
  streams[projectId] = closeStream

  stream
    .on('data', async (data) => {
      try {
        const json = JSON.parse(data)
        if (json.connection_issue) {
          await abortFechtingTweets({ projectId, error: json })
        } else if (json.data) {
          const tweet = json.data
          const expansions = json.includes
          if (!tweet.id) return
          // saving only tweets only if they belong to the right project.
          const ruleId = rules[0].id
          const matchingRuleId = json.matching_rules[0].id.toString()
          // when parsing large ints such as id the last 2 digits gets rounded
          // dirty hack that needs some love
          if (ruleId.slice(0, -3) !== matchingRuleId.slice(0, -3)) return

          TweetModel.create({
            id: tweet.id,
            tweet_data: { ...tweet, ...expansions },
            project_id: projectId,
          })
        } else {
          await abortFechtingTweets({ projectId, error: json })
        }
      } catch (e) {
        if (data !== ' ') {
          console.log(e)
        }
      }
    })
    .on('error', async (error) => {
      await abortFechtingTweets({ projectId, error: e })
    })
}

const getAllRules = async (credentials) => {
  const { data, error } = await axios.get(
    'https://api.twitter.com/2/tweets/search/stream/rules',
    {
      headers: {
        Authorization: `Bearer ${credentials.bearer_token}`,
      },
    }
  )
  if (error) {
    console.log('Error:', error)
    throw new Error(error)
  }
  if (!data.data) return undefined
  return data
}

const deleteAllRules = async (rules, credentials) => {
  if (!Array.isArray(rules.data)) {
    return null
  }
  const ids = rules.data.map((rule) => rule.id)
  ids.map(async (id) => {
    await deleteRule(id, credentials)
  })
}

const resetStreams = async (credentials) => {
  const rules = await getAllRules(credentials)
  if (rules) {
    await deleteAllRules(rules, credentials)
  }
  streams.map((closeStream) => {
    closeStream()
  })
  await ProjectModel.updateMany({}, { running: false })
}

const RequestService = {
  replyToTweet,
  getConversationId,
  getTweetById,
  addRule,
  deleteRule,
  startFetchingTweets,
  stopFetchingTweets,
  resetStreams,
}
module.exports = RequestService
