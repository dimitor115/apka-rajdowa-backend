import * as express from 'express'
import { resultHandler, authorization, userPermissions } from 'middlewares'
import { SchemasService } from 'services'
import { USER_ROLE } from 'common/constants'

const router = express.Router()

router.post('/events/:id/schema', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => SchemasService.create(req.body.name, req.body.schema, req.params.id)))

router.get('/schemas/:id/public', resultHandler(req => SchemasService.getPublic(req.params.id)))

router.get('/schemas/:id/private', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => SchemasService.getPrivate(req.params.id)))

export default router
