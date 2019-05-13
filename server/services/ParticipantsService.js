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
            const page = parseInt(parsedQuery.page, 0) || parseInt(process.env.DEFAULT_PAGE, 0) || 1
            const count = parseInt(parsedQuery.count, 0) || parseInt(process.env.DEFAULT_PER_PAGE, 0) || 50

            const fields = {
                projection: parsedQuery.fields
                    ? Object.keys(parsedQuery.fields).reduce((aggregate, key) => ({
                        ...aggregate, [key]: parseInt(parsedQuery.fields[key], 0)
                    }), {})
                    : {}
            }

            const sort = parsedQuery.sort ? Object.keys(parsedQuery.sort)
                .reduce((aggregate, key) => ({
                    ...aggregate, [key]: parseInt(parsedQuery.sort[key], 0)
                }), {}) : {}

            const promiseList = mongoose.connection.collection(`form_${formId}`)
                .find(parsedQuery.filter, fields)
                .skip((page - 1) * count)
                .limit(count)
                .sort(sort)
                .toArray()

            const promiseTotal = mongoose.connection.collection(`form_${formId}`)
                .count(parsedQuery.filter, fields)

            const [list, total] = [await promiseList, await promiseTotal]
            const pages = list.length ? Math.trunc(total / count) || 1 : 0
            const meta = { total, pages, current_page: page }

            return new Response({ list, meta }, 200)
        }
    }

    async add(formId, type, data) {
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
