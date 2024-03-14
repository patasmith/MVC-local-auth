const mongoose = require('mongoose')
const config = require('../utils/config')
const log = require('../utils/log')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI)
    log.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
