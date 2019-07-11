import logger from 'common/logger'
import { Event } from 'models'
import {
    byIdQuery, mapEmailsToUsers, Response, Exception
} from 'common/utils'

class AdministratorsService {
    async remove(eventId, adminId) {
        logger.info(`Removing admin : ${adminId} from event: ${eventId}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $pull: { administrators: { userId: adminId } } },
            { new: true }
        )

        if (result) {
            return new Response(result.administrators)
        } else {
            throw new Exception(`Admin with id: ${adminId} doesn't exist`)
        }
    }

    async changeRole(eventId, adminId, newRole) {
        logger.info(`Changing admin : ${adminId} role to ${newRole}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $set: { 'administrators.$[element].role': newRole } },
            { arrayFilters: [{ 'element.userId': { $eq: adminId } }], new: true }
        )

        if (result) {
            return new Response(result.administrators)
        } else {
            throw new Exception(`Admin with id: ${adminId} doesn't exist`)
        }
    }

    async add(eventId, payload) {
        logger.info(`Creating new admin ${payload.email} for event : ${eventId}`)
        const messages = []
        const user = await _findUserByEmail(payload.email, messages)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $push: { administrators: user } },
            { new: true }
        )

        if (result) {
            return new Response(result.administrators, 201, messages)
        } else {
            throw new Exception(`Error during creating new admin for event: ${eventId}`)
        }
    }
}

async function _findUserByEmail(email, messages) {
    return (await Promise.all(mapEmailsToUsers([email], messages)))[0]
}

export default new AdministratorsService()
