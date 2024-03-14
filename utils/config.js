require('dotenv').config()

const PORT = process.env.PORT || 3001
const EXT = '.' + process.env.EXT
const NODE_ENV = process.env.NODE_ENV
const MONGO_URI = process.env.MONGO_URI

module.exports = {
  PORT,
  EXT,
  NODE_ENV,
  MONGO_URI
}
