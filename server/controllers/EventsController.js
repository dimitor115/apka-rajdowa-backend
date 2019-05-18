import * as express from 'express'
import multer from 'multer'
import { resultHandler, authorization } from 'middlewares'
import eventsService from '../services/EventsService'

const router = express.Router()
const upload = multer({ dest: process.env.UPLOAD_DIR || 'public/uploads' })

router.get('/all/:organisationId', resultHandler(req => eventsService.findAll(req.params.organisationId)))
router.post('/', authorization, upload.single('logo'), resultHandler(req => eventsService.add(req.body, req.file, req.user)))
router.put('/:id', resultHandler(req => eventsService.update(req.params.id, req.body)))
router.delete('/:id', resultHandler(req => eventsService.delete(req.params.id)))

export default router
