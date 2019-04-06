import * as express from 'express'
import resultHandler from '../middlewares/resultHandler'
import { ParticipantsService } from '../services'

const router = express.Router()
router.post('/', resultHandler(req => ParticipantsService.add(req.header('form-id'), 'private', req.body)))
router.post('/form', resultHandler(req => ParticipantsService.add(req.header('form-id'), 'public', req.body)))
router.patch('/', resultHandler(req => ParticipantsService.edit(req.header('form-id'), req.query, req.body)))
router.get('/', resultHandler(req => ParticipantsService.find(req.header('form-id'), req.query)))

export default router
