import log from 'common/logger'

import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'

mongoose.plugin(slug)

const connect = url => {
    mongoose.connection
        .on('connected', () => log.info('Connected to the DB'))
        .on('error', () => log.error('Error with database connection'))
        .on('disconnected', connect)
    return mongoose.connect(url, { keepAlive: true, useNewUrlParser: true })
}

export default connect
