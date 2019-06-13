import mongoose from 'mongoose'
import qs from 'qs'
import { Schema } from 'models'
import { Response, Exception } from 'common/utils'
import SchemasService from './SchemasService'

const ACCESS_PRIVATE = 'private'
const ACCESS_PUBLIC = 'public'
const RANGES_ACCESS = [ACCESS_PRIVATE, ACCESS_PUBLIC]

class ParticipantsService {
    async find(formSlug, query = '') {
        if (!this.checkCollectionExists(formSlug)) {
            throw new Exception(`Not found collection form_${formSlug}`, 404)
        } else {
            const parsedQuery = qs.parse(query)
            const page = parseInt(parsedQuery.page, 10) || parseInt(process.env.DEFAULT_PAGE, 10) || 1
            const count = parseInt(parsedQuery.count, 10) || parseInt(process.env.DEFAULT_PER_PAGE, 10) || 50

            const filters = Object.keys(parsedQuery.filters || {}).reduce((obj, key) => ({
                ...obj,
                [key]: {
                    $in: parsedQuery.filters[key]
                }
            }), {})

            const fields = {
                projection: parsedQuery.fields
                    ? Object.keys(parsedQuery.fields).reduce((aggregate, key) => ({
                        ...aggregate, [key]: parseInt(parsedQuery.fields[key], 10)
                    }), {})
                    : {}
            }

            const sort = parsedQuery.sort ? Object.keys(parsedQuery.sort)
                .reduce((aggregate, key) => ({
                    ...aggregate, [key]: parseInt(parsedQuery.sort[key], 10)
                }), {}) : {}

            const promiseList = mongoose.connection.collection(`form_${formSlug}`)
                .find(filters, fields)
                .skip((page - 1) * count)
                .limit(count)
                .sort(sort)
                .toArray()

            const promiseTotal = mongoose.connection.collection(`form_${formSlug}`)
                .countDocuments(filters)

            const [list, total] = [await promiseList, await promiseTotal]
            const pages = list.length ? Math.trunc(total / count) || 1 : 0
            const meta = { total, pages, current_page: page }

            return new Response({ list, meta }, 200)
        }
    }

    async add(formSlug, type, data) {
        const formModel = await this.getModel(formSlug, type)
        const result = await formModel.create(data)

        return new Response(result, 201)
    }

    async edit(formSlug, query, data) {
        const parsedQuery = qs.parse(query)
        const formModel = await this.getModel(formSlug, ACCESS_PRIVATE)
        const result = await formModel.updateMany(parsedQuery, data)

        if (result && result.acknowledged) {
            return new Response(result)
        } else {
            throw new Exception(`No Participants were found by given query ${query}`)
        }
    }

    async editOne(formId, participantId, data) {
        const formModel = await this.getModel(formId, ACCESS_PRIVATE)
        const result = await formModel.findOneAndUpdate(
            { _id: participantId },
            data,
            { new: true }
        )
        if (result) {
            return new Response(result)
        } else {
            throw new Exception(`Could not found Participant by given id: ${participantId}`)
        }
    }

    async remove(formId, participantId) {
        const formModel = await this.getModel(formId, ACCESS_PRIVATE)
        const result = await formModel.findOneAndDelete({ _id: participantId })

        if (result) {
            return new Response(result)
        } else {
            throw new Exception(`Could not found Participant by given id: ${participantId}`)
        }
    }

    async getModel(formSlug, type = ACCESS_PUBLIC) {
        if (!this.checkCollectionExists(formSlug)) {
            throw new Exception(`Not found collection form_${formSlug}`, 404)
        } else if (!RANGES_ACCESS.includes(type)) {
            throw (new Exception(`Error type range access. Available options: ${RANGES_ACCESS.join(', ')}`))
        } else {
            const schemaName = `form_${formSlug}_${type}`
            if (mongoose.modelNames().includes(schemaName)) {
                return mongoose.model(schemaName)
            }

            const schema = await Schema.findOne({ slug: formSlug })

            if (type === ACCESS_PUBLIC) {
                schema.structure = await SchemasService.parseToPublic(schema.structure)
            }

            const formSchema = mongoose.Schema(schema.structure, {
                versionKey: false,
                collection: `form_${formSlug}`
            })
            return mongoose.model(schemaName, formSchema)
        }
    }

    async checkCollectionExists(formSlug) {
        const collections = await mongoose.connection.db.listCollections().toArray()

        return collections.some(collection => collection.name === `form_${formSlug}`)
    }
}

export default new ParticipantsService()
