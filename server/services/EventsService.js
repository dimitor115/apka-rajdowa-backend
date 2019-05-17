import fs from 'fs'
import ip from 'ip'
import eventModel from '../models/event'
import Response from '../common/utils/Response'
import Exception from '../common/utils/Exception'
import logger from '../common/logger'

const uploadDir = process.env.UPLOAD_DIR || 'public/uploads'
const port = process.env.PORT || '3000'
const addressPrefix = `http://${ip.address()}:${port}`

const parseEventLogoUrl = event => {
    event.logo = addressPrefix + event.logo
    return event
}

class EventsService {
    async add(event, img) {
    // TODO: sprawdzanie poprawności aliasu email
        logger.info(`Creating new event with name ${event.name}`)
        event.logo = `/static/img/${img.filename}`
        const result = await eventModel.create(event)
        return new Response(result, 201)
    }

    async delete(_id) {
        logger.info(`Deleting event with id : ${_id}`)
        const result = await eventModel.findOneAndDelete({ _id })
        if (result == null) {
            throw new Exception(`Event with id ${_id} doesn't exist`)
        } else {
            const fileName = result.logo.split('/img/')[1]
            await fs.promises.unlink(`${uploadDir}/${fileName}`)
            logger.info(`Removing file : ${fileName}`)
            return new Response(result)
        }
    }

    async update(_id, event) {
        logger.info(`Updating event with id ${_id}`)
        const result = await eventModel.findOneAndUpdate({ _id }, event, { new: true })
        if (result == null) {
            throw new Exception(`Event with id ${_id} doesn't exist`)
        } else {
            return new Response(event)
        }
    }

    async findAll(organisationId) {
        logger.info(`Fetching all events for organisation ${organisationId}`)
        const events = await eventModel.find({ organisationId })
        return new Response(
            events
        )
    }

    async findAllEmailAliases() {
        logger.info('Fetching all email aliases in db')
        const data = await eventModel.find({}, {
            emailAlias: true,
            _id: false
        }).then(result => result.map(x => x.emailAlias))
        return new Response(data)
    }
}

export default new EventsService()
