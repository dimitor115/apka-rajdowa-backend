import * as express from 'express'

import resultHandler from '../middlewares/resultHandler'
import { FormsService } from '../services'

const router = express.Router()
//TODO: zabezpieczyc routy
router.post('/', resultHandler(req => FormsService.create(req.headers.form_id, 'private', req.body)))
router.post('/form', resultHandler(req => FormsService.create(req.headers.form_id, 'public', req.body)))
router.patch('/', resultHandler(req => FormsService.edit(req.headers.form_id, req.query, req.body)))
router.get('/', resultHandler(req => FormsService.find(req.headers.form_id, req.query)))

export default router
