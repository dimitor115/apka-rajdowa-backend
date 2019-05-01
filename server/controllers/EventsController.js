import * as express from 'express'
import multer from 'multer'
import resultHandler from '../middlewares/resultHandler'
import eventsService from '../services/EventsService'

const router = express.Router()
const upload = multer({ dest: 'public/uploads/' })

router.get('/all/:organisationId', resultHandler(req => eventsService.findAll(req.params.organisationId)))
router.post('/', upload.single('logo'), resultHandler(req => eventsService.add(req.body, req.file)))
router.put('/:id', resultHandler(req => eventsService.update(req.params.id, req.body)))
router.delete('/:id', resultHandler(req => eventsService.delete(req.params.id)))
router.get('/email-aliases', resultHandler(() => eventsService.findAllEmailAliases()))

export default router
