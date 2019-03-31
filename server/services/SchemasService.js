import mongoose from 'mongoose'
import l from '../common/logger'
import Response from '../common/utils/Response'
import { Schema } from '../models'

//TODO: dodac logi
class SchemasService {
    async create(name, schema) {
        l.info(`${this.constructor.name}.create()`)

        //TODO: validacja schemy
        //pola obowiazkowe
        //zawartosc pol - type
        //pola nadmiarowe nie wykorzystywane w apce
        //unikalnosc elementow
        //TODO: przypisanie schemy do wydarzenia

        return Schema.create({ name, structure: schema })
            .then(newSchema => mongoose.connection.createCollection(`form_${newSchema._id}`)
                .then(() => new Response({ id: newSchema._id }, 201)))

            .catch(err => new Response(err, 500))
    }

    async getPublic(id) {
        return Schema.findOne({ _id: id })
            .then(foundSchema => {
                const filteredSchema = this.createPublicSchema(foundSchema.structure)
                return new Response({ name: foundSchema.name, structure: filteredSchema }, 200)
            })
            .catch(err => new Response(err, 500))
    }

    async getPrivate(id) {
        return Schema.findOne({ _id: id })
            .then(result => new Response(result, 200))
            .catch(err => new Response(err, 500))
    }

    async valid(schema) {
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
