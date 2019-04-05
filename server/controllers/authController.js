import * as express from 'express'
import createToken from '../auth/jwtToken'
import { authentication, authorization } from '../middlewares'

const router = express.Router()

router.get('/google', authentication)
router.get('/google/callback', authentication, (req, res) => {
    const token = createToken(req.user)
    res.status(req.authInfo || 500).send({ token })
})
router.get('/test', authorization, (req, res) => res.send('elo'))

export default router
