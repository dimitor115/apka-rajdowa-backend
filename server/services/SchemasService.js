import mongoose from 'mongoose'
import { Schema, Event } from 'models'
import logger from 'common/logger'
import { Response, Exception, byIdQuery } from 'common/utils'

class SchemasService {
    async create(formDetails, schema, eventId) {
        logger.info(`Creating new schema : ${formDetails.name}`)
        const newSchema = await Schema.create({
            name: formDetails.name,
            description: formDetails.description,
            colors: {
                primary: formDetails.primaryColor,
                background: formDetails.backgroundColor
            },
            structure: schema
        })
        await Promise.all([
            mongoose.connection.createCollection(`form_${newSchema.slug}`),
            this.saveSchemaToEvent(eventId, newSchema.slug)
        ])
        return new Response({ slug: newSchema.slug }, 201)
    }

    async getPublic(slug) {
        logger.info(`Fetching public schema : ${slug}`)
        const schema = await Schema.findOne(byIdQuery(slug))

        if (!schema) {
            throw new Exception(`Not found schema by slug: ${slug}`, 404)
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

    async saveSchemaToEvent(eventId, schemaSlug) {
        logger.info(`Saving schema (${schemaSlug}) to event : ${eventId}`)
        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $push: { forms: schemaSlug } }
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
