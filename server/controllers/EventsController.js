import * as express from 'express'
import multer from 'multer'
import { resultHandler, authorization, userPermissions } from 'middlewares'
import { EventService } from 'services'
import { USER_ROLE } from 'common/constants'

const router = express.Router()
const upload = multer({ dest: process.env.UPLOAD_DIR || 'public/uploads' })

router.get('/', authorization,
    resultHandler(req => EventService.findAll(req.user)))

router.get('/:id', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => EventService.findById(req.params.id)))

router.post('/', authorization, upload.single('logo'),
    resultHandler(req => EventService.add(req.body, req.file, req.user)))

router.put('/:id', userPermissions(USER_ROLE.OWNER),
    resultHandler(req => EventService.update(req.params.id, req.body)))

router.delete('/:id', userPermissions(USER_ROLE.OWNER),
    resultHandler(req => EventService.delete(req.params.id)))

export default router
