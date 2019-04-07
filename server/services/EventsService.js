import eventModel from '../models/event'
import Response from '../common/utils/Response'
import Exception from '../common/utils/Exception'
import logger from '../common/logger'

class EventsService {
  async add(event) {
    // TODO: sprawdanie czy organizacja o takim id istanieje, jak już bedzie obsługa organizacji
    // TODO: sprawdzanie poprawności aliasu email
    // TODO: załączenie linku do zdjęcia
    logger.info(`Creating new event with name ${event.name}`)
    const result = await eventModel.create(event)
    return new Response(result, 201)
  }

  async delete(_id) {
    logger.info(`Deleting event with id : ${_id}`)
    const result = await eventModel.findOneAndDelete({ _id })
    if (result == null) {
      throw new Exception(`Event with id ${_id} doesn't exist`)
    } else {
      return new Response(result)
    }
  }

  async update(_id, event) {
    logger.info(`Updating event with id ${_id}`)
    const result = await eventModel.findOneAndUpdate({ _id }, event, { new: true })
    if (result == null) {
      throw new Exception(`Event with id ${_id} doesn't exist`)
    } else {
      return new Response(result)
    }
  }

  async findAll(organisationId) {
    logger.info(`Fetching all events for organisation ${organisationId}`)
    return new Response(
      await eventModel.find({ organisationId })
    )
  }

  async findAllEmailAliases() {
    logger.info('Fetching all email aliases in db')
    const data = await eventModel.find({}, {
      emailAlias: true,
      _id: false
    })
      .then(result => result.map(x => x.emailAlias))
    return new Response(data)
  }
}

export default new EventsService()
