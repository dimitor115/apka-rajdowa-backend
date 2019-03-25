import * as express from 'express'
import resultHandler from '../middlewares/resultHandler'
import eventsService from '../services/EventsService'

const router = express.Router()

// TODO: endpoint do dodawania loga

router.get('/all/:organisationId', resultHandler(req => eventsService.findAll(req.params.organisationId)))
router.post('/', resultHandler(req => EventsService.add(req.body)))
router.put('/:id', resultHandler(req => EventsService.update(req.params.id, req.body)))
router.delete('/:id', resultHandler(req => EventsService.delete(req.params.id)))
router.get('/email-aliases', resultHandler(() => eventsService.findAllEmailAliases()))

export default router
