import l from '../common/logger'
import db from './ExamplesDbService'
import Response from '../common/utils/Response'

class ExamplesService {
    async all() {
        l.info(`${this.constructor.name}.all()`)
        return new Response(await db.all())
    }

    async byId(id) {
        l.info(`${this.constructor.name}.byId(${id})`)
        return new Response(await db.byId(id))
    }

    async create(name) {
        l.info(`${this.constructor.name}.create()`)
        // const schema = Joi.object().keys({
        //   username: Joi.string().alphanum().min(6).max(16).required(),
        //   password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required()
        // }).with('username', 'password')
        // console.log(Joi.describe(schema))
        // const test = { username: name }
        // const result = await Joi.validate(test, schema)
        // l.info(result)
        return new Response(await db.insert(name), 201)
    }
}

export default new ExamplesService()
