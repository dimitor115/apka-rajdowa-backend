import * as express from 'express'
import { resultHandler } from 'middlewares'
import { SchemasService } from 'services'

const router = express.Router()
// TODO: autoryzacja i uprawnienia użytkownika
router.post('/', resultHandler(req => SchemasService.create(req.body.details, req.body.schema, req.body.eventId)))
router.get('/:id/public', resultHandler(req => SchemasService.getPublic(req.params.id)))
router.get('/:id/private', resultHandler(req => SchemasService.getPrivate(req.params.id)))

export default router
