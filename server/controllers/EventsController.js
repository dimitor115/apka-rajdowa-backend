import * as express from 'express'
import multer from 'multer'
import { resultHandler, authorization, userPermissions } from 'middlewares'
import eventsService from '../services/EventsService'

const router = express.Router()
const upload = multer({ dest: process.env.UPLOAD_DIR || 'public/uploads' })

router.get('/', authorization,
    resultHandler(req => eventsService.findAll(req.user)))

router.get('/:id', authorization, userPermissions('ADMIN'),
    resultHandler(req => eventsService.findById(req.params.id)))

router.post('/', authorization, upload.single('logo'),
    resultHandler(req => eventsService.add(req.body, req.file, req.user)))

router.put('/:id',
    resultHandler(req => eventsService.update(req.params.id, req.body)))

router.delete('/:id',
    resultHandler(req => eventsService.delete(req.params.id)))

export default router
