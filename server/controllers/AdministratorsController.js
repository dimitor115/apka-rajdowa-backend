import * as express from 'express'
import { resultHandler, authorization, userPermissions } from 'middlewares'
import { AdministratorsService } from 'services'
import { USER_ROLE } from 'common/constants'

const router = express.Router()

router.delete('/events/:id/administrators/:adminId', authorization, userPermissions(USER_ROLE.OWNER),
    resultHandler(req => AdministratorsService.remove(req.params.id, req.params.adminId)))

router.put('/events/:id/administrators/:adminId', authorization, userPermissions(USER_ROLE.OWNER),
    resultHandler(req => AdministratorsService.changeRole(req.params.id, req.params.adminId, req.body.role)))

router.post('/events/:id/administrators', authorization, userPermissions(USER_ROLE.OWNER),
    resultHandler(req => AdministratorsService.add(req.params.id, req.body)))

export default router
