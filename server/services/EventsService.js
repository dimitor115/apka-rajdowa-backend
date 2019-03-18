import mongose from 'mongoose'
import log from '../common/logger'

class EventsService {
  async addSchema() {
    log.info(`${this.constructor.name}.addSchema()`)
    const schema = mongose.Schema({
      name: String,
      index: String
    })
    const Model = mongose.model('Mongo-test', schema)
    return new Promise(resolve => Model.create(
      {
        name: 'ab',
        index: '324'
      }, (err, x) => {
        if (err) {
          resolve(err)
        } else {
          resolve(x)
        }
      }
    ))
  }
}

export default new EventsService()
