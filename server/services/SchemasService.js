import mongoose from 'mongoose'
import { Schema, Event } from 'models'
import logger from 'common/logger'
import { Response, Exception, byIdQuery } from 'common/utils'

class SchemasService {
    async create(name, schema, eventId) {
        logger.info(`Creating new sechma : ${name}`)
        const newSchema = await Schema.create({ name, structure: schema })
        await Promise.all([
            mongoose.connection.createCollection(`form_${newSchema._id}`),
            this.saveSchemaToEvent(eventId, newSchema._id)
        ])
        return new Response({ id: newSchema._id }, 201)
    }

    async getPublic(id) {
        logger.info(`Fetching public schema : ${id}`)
        const schema = await Schema.findOne({ _id: id })
        if (!schema) {
            throw new Exception(`Not found schema by id: ${id}`, 404)
        } else {
            schema.structure = this.parseToPublic(schema.structure)
            return new Response(schema, 200)
        }
    }

    async getPrivate(id) {
        logger.info(`Fetching public schema : ${id}`)
        const schema = await Schema.findOne({ _id: id })
        if (!schema) {
            throw new Exception(`Not found schema by id: ${id}`, 404)
        } else {
            return new Response(schema, 200)
        }
    }

    async saveSchemaToEvent(eventId, schemaId) {
        logger.info(`Saving schema (${schemaId}) to event : ${eventId}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $push: { forms: schemaId } }
        )
        if (!result) {
            throw Exception(`Nie ma wydarzenia o takim id ${eventId}`)
        }
    }

    parseToPublic(schema) {
        return Object.keys(schema)
            .reduce((aggregate, key) => (!schema[key].isHidden
                ? {
                    ...aggregate,
                    [key]: schema[key]
                }
                : aggregate
            ), {})
    }
}

export default new SchemasService()
