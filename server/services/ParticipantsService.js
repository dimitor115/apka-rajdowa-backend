import mongoose from 'mongoose'
import qs from 'qs'
import { Response, Exception } from '../common/utils'
import { Schema } from '../models'
import SchemasService from './SchemasService'

const ACCESS_PRIVATE = 'private'
const ACCESS_PUBLIC = 'public'
const RANGES_ACCESS = [ACCESS_PRIVATE, ACCESS_PUBLIC]

class ParticipantsService {
    async find(formId, query = '') {
        if (!this.checkCollectionExists(formId)) {
            throw new Exception(`Not found collection form_${formId}`, 404)
        } else {
            const parsedQuery = qs.parse(query)
            const fields = { projection: parsedQuery.fields }
            const sortBy = parsedQuery.sortBy ? await Object.keys(parsedQuery.sortBy)
                .reduce((aggregate, key) => (
                    { ...aggregate, [key]: parseInt(parsedQuery.sortBy[key], 0) }), {}) : {}

            const result = await mongoose.connection.collection(`form_${formId}`).find(parsedQuery.query, fields).sort(sortBy).toArray()
            return new Response(result, 200)
        }

    }

    async create(formId, type, data) {
        const formModel = await this.getModel(formId, type)
        const result = await formModel.create(data)

        return new Response(result, 201)
    }

    async edit(formId, query, data) {
        const parsedQuery = qs.parse(query)
        const formModel = await this.getModel(formId, ACCESS_PRIVATE)
        const result = await formModel.updateMany(parsedQuery, data)

        return new Response(result, 200)
    }

    async getModel(formId, type = ACCESS_PUBLIC) {
        if (!this.checkCollectionExists(formId)) {
            throw new Exception(`Not found collection form_${formId}`, 404)
        } else if (!RANGES_ACCESS.includes(type)) {
            throw (new Exception(`Error type range access. Available options: ${RANGES_ACCESS.join(', ')}`))
        } else {
            const schemaName = `form_${formId}_${type}`
            if (mongoose.modelNames().includes(schemaName)) {
                return mongoose.model(schemaName)
            }

            const schema = await Schema.findOne({ _id: formId })

            if (type === ACCESS_PUBLIC) {
                schema.structure = await SchemasService.parseToPublic(schema.structure)
            }

            const formSchema = mongoose.Schema(schema.structure, {
                versionKey: false,
                collection: `form_${formId}`
            })
            return mongoose.model(schemaName, formSchema)
        }
    }

    async checkCollectionExists(formId) {
        const collections = await mongoose.connection.db.listCollections().toArray()

        return collections.some(collection => collection.name === `form_${formId}`)
    }
}

export default new ParticipantsService()