import * as express from 'express'
import resultHandler from '../middlewares/resultHandler'
import { SchemasService } from '../services'

const router = express.Router()

router.post('/', resultHandler(req => SchemasService.create(req.body.name, req.body.schema)))
router.get('/:id/public', resultHandler(req => SchemasService.getPublic(req.params.id)))
router.get('/:id/private', resultHandler(req => SchemasService.getPrivate(req.params.id)))

export default router
