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
            this._saveSchemaToEvent(eventId, newSchema.slug)
        ])
        return new Response(newSchema, 201)
    }

    async getPublic(slug) {
        logger.info(`Fetching public schema : ${slug}`)
        const schema = await Schema.findOne(byIdQuery(slug)).lean()

        if (!schema) {
            throw new Exception(`Not found schema by slug: ${slug}`, 404)
        } else {
            schema.structure = _parseToPublic(schema.structure)
            return new Response(_parseFormSchema(schema), 200)
        }
    }

    async getPrivate(slug) {
        logger.info(`Fetching private schema : ${slug}`)
        const schema = await Schema.findOne(byIdQuery(slug)).lean()

        if (!schema) {
            throw new Exception(`Not found schema by slug: ${slug}`, 404)
        } else {
            return new Response(_parseFormSchema(schema), 200)
        }
    }

    async _saveSchemaToEvent(eventId, schemaSlug) {
        logger.info(`Saving schema (${schemaSlug}) to event : ${eventId}`)

        const result = await Event.findOneAndUpdate(
            byIdQuery(eventId),
            { $push: { forms: schemaSlug } }
        )
        if (!result) {
            throw Exception(`There is no event with given id : ${eventId}`)
        }
    }
}

function _parseToPublic(schemaStructure) {
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

function _parseFormSchema({ structure, ...rest }) {
    return {
        ...rest,
        structure: Object.keys(structure)
            .reduce((obj, key) => {
                obj[key] = _mapKeysToFrontFormat(structure[key][0] ? structure[key][0] : structure[key])
                return obj
            }, {})
    }
}

function _mapKeysToFrontFormat(fieldObj) {
    return Object.keys(fieldObj)
        .reduce((obj, key) => {
            if (DB_FIELD_KEYS_TO_FRONT_KEYS[key]) {
                obj[DB_FIELD_KEYS_TO_FRONT_KEYS[key]] = fieldObj[key]
            } else {
                obj[key] = fieldObj[key]
            }
            return obj
        }, {})
}

export default new SchemasService()
