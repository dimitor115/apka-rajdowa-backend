import mongoose from 'mongoose'
import Response from '../common/utils/Response'
import { Schema } from '../models'

class SchemasService {
    async create(name, schema) {
        const newSchema = await Schema.create({ name, structure: schema })
        await mongoose.connection.createCollection(`form_${newSchema._id}`)
        return new Response({ id: newSchema._id }, 201)
    }

    async getPublic(id) {
        const schema = await Schema.findOne({ _id: id })
        schema.structure = this.createPublic(schema.structure)
        return new Response({ schema }, 200)
    }

    async getPrivate(id) {
        const schema = await Schema.findOne({ _id: id })
        return schema
    }

    createPublic(schema) {
        return Object.keys(schema).reduce(
            (aggregate, key) => (!schema[key].isHidden
                ? { ...aggregate, [key]: schema[key] }
                : aggregate), {}
        )
    }
}

export default new SchemasService()
