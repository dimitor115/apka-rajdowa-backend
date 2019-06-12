import * as express from 'express'
import { ParticipantsService } from 'services'
import { resultHandler, authorization, userPermissions } from 'middlewares'
import { USER_ROLE } from '../common/constants'

const router = express.Router()

// TODO: ogarnać w przyszłości dla wszystkich routów brak events w routcie
// Na razie dodany taki route dla formularza zapisowego
router.post('/forms/:formId',
    resultHandler(req => ParticipantsService.add(req.params.formId, 'public', req.body)))

router.post('/events/:id/forms/:formId',
    resultHandler(req => ParticipantsService.add(req.params.formId, 'public', req.body)))

router.patch('/events/:id/forms/:formId/participants', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => ParticipantsService.edit(req.params.formId, req.query, req.body)))

router.patch('/events/:id/forms/:formId/participants/:participantId', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => ParticipantsService.editOne(req.params.formId, req.params.participantId, req.body)))

router.get('/events/:id/forms/:formId', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => ParticipantsService.find(req.params.formId, req.query)))

router.delete('/events/:id/forms/:formId/participants/:participantId', authorization, userPermissions(USER_ROLE.ADMIN),
    resultHandler(req => ParticipantsService.remove(req.params.formId, req.params.participantId)))

export default router
