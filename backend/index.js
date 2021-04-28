const mongoose = require('mongoose')
const app = require('./src/api')
const config = require('./src/config')

// connect to db
mongoose.connect(
  config.db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)

const db = mongoose.connection
db.on('error', () => console.error(console, 'db connection error:'))
db.once('open', () => console.log('connected to db'))
app.listen(3001)
