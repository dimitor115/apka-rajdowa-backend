import * as express from 'express'
import resultHandler from '../middlewares/resultHandler'
import eventsService from '../services/EventsService'

const router = express.Router()

router.post('/schema', resultHandler(() => eventsService.addSchema()))

export default router
