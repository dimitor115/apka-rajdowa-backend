import logger from 'common/logger'
import { Event } from 'models'
import { byIdQuery, mapEmailsToUsers, Response } from '../common/utils'

class AdministratorsService {
    async remove(eventId, adminId) {
        logger.info(`Removing admin : ${adminId} from event: ${eventId}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $pull: { administrators: { userId: adminId } } },
            { new: true }
        )
        return new Response(result.administrators)
    }

    async changeRole(eventId, adminId, newRole) {
        logger.info(`Changing admin : ${adminId} role to ${newRole}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $set: { 'administrators.$[element].role': newRole } },
            { arrayFilters: [{ 'element.userId': { $eq: adminId } }], new: true }
        )
        return new Response(result.administrators)
    }

    async add(eventId, payload) {
        logger.info(`Creating new admin ${payload.email} for event : ${eventId}`)
        const messages = []
        const user = await findUserByEmail(payload.email, messages)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $push: { administrators: user } },
            { new: true }
        )
        return new Response(result.administrators, 201, messages)
    }
}

async function findUserByEmail(email, messages) {
    return (await Promise.all(mapEmailsToUsers([email], messages)))[0]
}

export default new AdministratorsService()
