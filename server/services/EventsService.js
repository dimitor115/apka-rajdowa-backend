import fs from 'fs'
import { Event } from 'models'
import {
    Response, Exception, byIdQuery, mapEmailsToUsers
} from 'common/utils'
import logger from 'common/logger'
import { USER_ROLE } from 'common/constants'

const uploadDir = process.env.UPLOAD_DIR || 'public/uploads'

class EventsService {
    async add(event, img, user) {
        logger.info(`Creating new event with name ${event.name} by ${user.google.email}`)
        const { administrators, messages } = await _prepareAdministrators(event.usersEmails, user._id, user.google.email)
        const parsedEvent = {
            ...event,
            administrators,
            forms: [],
            logo: `/static/img/${img.filename}`
        }
        const result = await Event.create(parsedEvent)

        return new Response(result, 201, messages)
    }

    async delete(id) {
        logger.info(`Deleting event : ${id}`)
        const query = byIdQuery(id)
        const result = await Event.findOneAndDelete(query)

        if (result) {
            await _removeEventLogo(result)
            return new Response(result)
        } else {
            throw new Exception(`Event with id ${id} doesn't exist`)
        }
    }

    async update(id, event) {
        logger.info(`Updating event with id ${id}`)
        const query = byIdQuery(id)
        const result = await Event.findOneAndUpdate(query, { $set: event }, { new: true })

        if (result) {
            return new Response(event)
        } else {
            throw new Exception(`Event with id ${id} doesn't exist`)
        }
    }

    async findAll(user) {
        logger.info(`Fetching all events for ${user.google.email}`)
        const events = await Event.find(
            { 'administrators.userId': user._id },
            {
                _id: false,
                forms: false,
                administrators: false,
                emailAlias: false
            }
        )

        return new Response(events)
    }

    async findById(id) {
        logger.info(`Fetching event ${id} details`)
        const query = byIdQuery(id)
        const result = await Event.findOne(query)

        return new Response(result)
    }
}

async function _removeEventLogo(result) {
    const fileName = result.logo.split('/img/')[1]
    await fs.promises.unlink(`${uploadDir}/${fileName}`)
    logger.info(`Removing file : ${fileName}`)
}

async function _prepareAdministrators(emails, ownerId, ownerEmail) {
    const messages = []
    const owner = { userId: ownerId, role: USER_ROLE.OWNER, email: ownerEmail }
    const emailsArray = emails.includes(',')
        ? emails.split(',')
        : []
    const administrators = await Promise.all(mapEmailsToUsers(emailsArray, messages))
    return { administrators: [owner, ...administrators], messages }
}

export default new EventsService()
