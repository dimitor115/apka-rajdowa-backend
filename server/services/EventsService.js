import fs from 'fs'
import { Event, User } from 'models'
import { Response, Exception, isObjectID } from 'common/utils'
import logger from 'common/logger'

const uploadDir = process.env.UPLOAD_DIR || 'public/uploads'

class EventsService {
    async add(event, img, user) {
        logger.info(`Creating new event with name ${event.name} by ${user.google.email}`)
        const parseResult = await parseAdministrators(event.otherAdministrators, user._id)
        event.administrators = parseResult.administrators
        event.forms = []
        event.logo = `/static/img/${img.filename}`
        const result = await Event.create(event)
        return new Response(result, 201, parseResult.messages)
    }

    async delete(_id) {
        logger.info(`Deleting event with id : ${_id}`)
        const result = await Event.findOneAndDelete({ _id })
        if (result !== null) {
            const fileName = result.logo.split('/img/')[1]
            await fs.promises.unlink(`${uploadDir}/${fileName}`)
            logger.info(`Removing file : ${fileName}`)
            return new Response(result)
        } else {
            throw new Exception(`Event with id ${_id} doesn't exist`)
        }
    }

    async update(_id, event) {
        logger.info(`Updating event with id ${_id}`)
        const result = await Event.findOneAndUpdate({ _id }, event, { new: true })
        if (result == null) {
            throw new Exception(`Event with id ${_id} doesn't exist`)
        } else {
            return new Response(event)
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
        return new Response(
            events
        )
    }

    async findById(id) {
        logger.info(`Fetching event ${id} details`)
        const query = isObjectID(id)
            ? { _id: id }
            : { slug: id }
        const result = await Event.findOne(query)
        return new Response(result)
    }

    async findAllEmailAliases() {
        logger.info('Fetching all email aliases in database')
        const data = await Event.find({}, {
            emailAlias: true,
            _id: false
        })
            .then(result => result.map(x => x.emailAlias))
        return new Response(data)
    }
}

export default new EventsService()

// TODO: refactore this function
async function parseAdministrators(otherAdministrators, ownerId) {
    const messages = []
    const owner = {
        userId: ownerId,
        role: 'OWNER'
    }
    const administratorsArray = otherAdministrators.includes(',')
        ? otherAdministrators.split(',')
        : []
    const administrators = await Promise.all(administratorsArray
        .map(async email => {
            const result = await User.findOne({ 'google.email': email })
            if (result) {
                return {
                    userId: result._id,
                    role: 'ADMIN'
                }
            } else {
                messages.push(`Użytkownik ${email} będzie miał dostęp do wydarzenia po pierwszym logowaniu.
                 Nie mamy go jeszcze w systemie`)
                return {
                    userId: email, // This email will be replace by user id after user first login
                    role: 'ADMIN'
                }
            }
        }))
    return {
        administrators: [owner, ...administrators],
        messages
    }
}
