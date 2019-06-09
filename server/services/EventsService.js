import fs from 'fs'
import { Event, User } from 'models'
import { Response, Exception, byIdQuery } from 'common/utils'
import logger from 'common/logger'
import { USER_ROLE } from 'common/constants'

const uploadDir = process.env.UPLOAD_DIR || 'public/uploads'

class EventsService {
    async add(event, img, user) {
        logger.info(`Creating new event with name ${event.name} by ${user.google.email}`)
        const parseResult = await prepareAdministrators(event.usersEmails, user._id)
        event.administrators = parseResult.administrators
        event.forms = []
        event.logo = `/static/img/${img.filename}`
        const result = await Event.create(event)
        return new Response(result, 201, parseResult.messages)
    }

    async delete(id) {
        logger.info(`Deleting event : ${id}`)
        const query = byIdQuery(id)
        const result = await Event.findOneAndDelete(query)
        if (result) {
            await removeEventLogo(result)
            return new Response(result)
        } else {
            throw new Exception(`Event with id ${id} doesn't exist`)
        }
    }

    async update(id, event) {
        logger.info(`Updating event with id ${id}`)
        const query = byIdQuery(id)
        const result = await Event.findOneAndUpdate(query, event, { new: true })
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

async function removeEventLogo(result) {
    const fileName = result.logo.split('/img/')[1]
    await fs.promises.unlink(`${uploadDir}/${fileName}`)
    logger.info(`Removing file : ${fileName}`)
}

async function prepareAdministrators(emails, ownerId) {
    const messages = []
    const owner = { userId: ownerId, role: USER_ROLE.OWNER }
    const emailsArray = emails.includes(',')
        ? emails.split(',')
        : []
    const administrators = await Promise.all(mapEmailsToUsers(emailsArray, messages))
    return { administrators: [owner, ...administrators], messages }
}

function mapEmailsToUsers(users, messages) {
    return users.map(async email => {
        const result = await User.findOne({ 'google.email': email })
        if (result) {
            return { userId: result._id, role: USER_ROLE.ADMIN }
        } else {
            messages.push(`Użytkownik ${email} będzie miał dostęp do wydarzenia po pierwszym logowaniu.
                 Nie mamy go jeszcze w systemie`)
            // This email will be replace by user id after user first login
            return { userId: email, role: USER_ROLE.OWNER }
        }
    })
}

export default new EventsService()
