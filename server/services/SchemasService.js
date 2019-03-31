import mongoose from 'mongoose'
import { Response, Exception } from '../common/utils'
import { Schema } from '../models'

class SchemasService {
    async create(name, schema) {
        const newSchema = await Schema.create({ name, structure: schema })
        await mongoose.connection.createCollection(`form_${newSchema._id}`)
        return new Response({ id: newSchema._id }, 201)
    }

    async getPublic(id) {
        const schema = await Schema.findOne({ _id: id })

        if (!schema) {
            throw new Exception(`Not found schema by id: ${id}`, 404)
        }

        schema.structure = this.createPublic(schema.structure)

        return new Response(schema, 200)
    }

    async getPrivate(id) {
        const schema = await Schema.findOne({ _id: id })
        return new Response(schema, 200)
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
