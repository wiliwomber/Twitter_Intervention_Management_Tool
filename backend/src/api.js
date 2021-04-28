const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const projects = require('./routes/project')
const responses = require('./routes/responses')
const credentials = require('./routes/credentials')
const tweets = require('./routes/tweets')

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

// Basic route
app.get('/', (req, res) => { res.json({ name: 'Twitter Bot Management Tool Backend' }) })

app.use('/projects', projects)
app.use('/responses', responses)
app.use('/credentials', credentials)
app.use('/tweets', tweets)

module.exports = app
