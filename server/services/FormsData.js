import mongoose from 'mongoose'
import l from '../common/logger'
import Response from '../common/utils/Response'
import { Schema } from '../models'
import SchemasService from './SchemasService'

class FormsService {
    async get(id, query = {}, sortBy = {}) {
        return mongoose.connection.collection(`form_${id}`).find(query, sortBy)
            .then(result => new Response(result, 200))
            .catch(err => new Response(err, 500))
    }

    async createPublic(id, data) {
        try {
            let formModel = mongoose.Model

            if (mongoose.modelNames().includes(`form_${id}_public`)) {
                formModel = mongoose.model(`form_${id}_public`)
            } else {
                let schema = await Schema.findOne({ _id: id })
                schema = await SchemasService.createPublic(schema.structure)
                const formSchema = mongoose.Schema(schema, {
                    versionKey: false,
                    collection: `form_${id}`
                })
                formModel = mongoose.model(`form_${id}_public`, formSchema)
            }
            const result = await formModel.create(data)

            return new Response(result, 201)
        } catch (err) {
            return new Response(err, 500)
        }
    }

    async createPrivate(id, data) {
        try {
            let formModel = mongoose.Model

            if (mongoose.modelNames().includes(`form_${id}_private`)) {
                formModel = mongoose.model(`form_${id}_private`)
            } else {
                const schema = await Schema.findOne({ _id: id })

                const formSchema = mongoose.Schema(schema.structure, {
                    versionKey: false,
                    collection: `form_${id}`
                })
                formModel = mongoose.model(`form_${id}_private`, formSchema)
            }
            const result = await formModel.create(data)

            return new Response(result, 201)
        } catch (err) {
            return new Response(err, 500)
        }
    }

    async Edit(id, data) {
        return new Response({ id, data })
    }
}

export default new FormsService()
