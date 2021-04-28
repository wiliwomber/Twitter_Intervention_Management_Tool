const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  running: { type: Boolean, required: true },
  query: {
    q: { type: String, required: true },
    credentials: { type: String, required: true },
    rules: [
      {
        id: { type: String, required: false },
        value: { type: String, required: false },
        tag: { type: String, required: false },
      },
    ],
  },
  data_fields: {
    on_intervention: {
      query: { type: String, required: false },
      tweet_fields: { type: Array, required: false },
      user_fields: { type: Array, required: false },
    },
  },
})

const project = mongoose.model('Project', projectSchema)

module.exports = project
