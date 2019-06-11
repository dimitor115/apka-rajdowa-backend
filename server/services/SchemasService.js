import mongoose from 'mongoose'
import { Schema, Event } from 'models'
import logger from 'common/logger'
import { Response, Exception, byIdQuery } from 'common/utils'

const DB_FIELD_KEYS_TO_FRONT_KEYS = {
    name: 'label',
    htmlType: 'type',
    enum: 'values',
    type: 'dataType'
}

const mapKeysToFrontFormat = fieldObj => (
    // Mutuje akumulator (xD) bo jest szybsze niż spread operator
    Object.keys(fieldObj)
        .reduce((obj, key) => {
            if (DB_FIELD_KEYS_TO_FRONT_KEYS[key]) {
                obj[DB_FIELD_KEYS_TO_FRONT_KEYS[key]] = fieldObj[key]
            } else {
                obj[key] = fieldObj[key]
            }
            return obj
        }, {})
)

const parseFormSchema = ({ structure, ...rest }) => ({
    ...rest,
    structure: Object.keys(structure).reduce((obj, key) => {
        obj[key] = mapKeysToFrontFormat(structure[key][0] ? structure[key][0] : structure[key])
        return obj
    }, {})
})


class SchemasService {
    async create(formDetails, schema, eventId) {
        logger.info(`Creating new schema : ${formDetails.name}`)
        const newSchema = await Schema.create({
            name: formDetails.name,
            description: formDetails.description,
            colors: {
                primary: formDetails.colors && formDetails.colors.primaryColor,
                background: formDetails.colors && formDetails.colors.backgroundColor
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
        const schema = await Schema.findOne(byIdQuery(slug)).lean()

        if (!schema) {
            throw new Exception(`Not found schema by slug: ${slug}`, 404)
        } else {
            schema.structure = this.parseToPublic(schema.structure)
            return new Response(parseFormSchema(schema), 200)
        }
    }

    async getPrivate(id) {
        logger.info(`Fetching public schema : ${id}`)
        const schema = await Schema.findOne({ _id: id }).lean()
        if (!schema) {
            throw new Exception(`Not found schema by id: ${id}`, 404)
        } else {
            return new Response(parseFormSchema(schema), 200)
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

    parseToPublic(schemaStructure) {
        return Object.keys(schemaStructure)
            .reduce((aggregate, key) => (
                !schemaStructure[key].isHidden
                    ? {
                        ...aggregate,
                        [key]: schemaStructure[key]
                    }
                    : aggregate
            ), {})
    }
}

export default new SchemasService()
