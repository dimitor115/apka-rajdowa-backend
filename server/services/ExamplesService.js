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
        return new Response(await db.insert(name), 201)
    }
}

export default new ExamplesService()
