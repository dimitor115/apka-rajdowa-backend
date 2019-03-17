import log from '../common/logger'

const mongoose = require('mongoose')

const connect = url => {
  mongoose.connection
    .on('connected', () => log.info('Connected to the DB'))
    .on('error', () => log.error('Error with database connection'))
    .on('disconnected', connect)
  return mongoose.connect(url, { keepAlive: 1, useNewUrlParser: true })
}

export default connect
