import * as express from 'express'

import resultHandler from '../middlewares/resultHandler'
import { FormsService } from '../services'

const router = express.Router()

router.post('/', resultHandler(req => FormsService.createPrivate(req.headers.form_id, req.body)))
router.post('/form', resultHandler(req => FormsService.createPublic(req.headers.form_id, req.body)))
router.get('/:id', resultHandler(req => FormsService.get(req.params.id, req.query)))

export default router
