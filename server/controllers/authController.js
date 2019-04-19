import * as express from 'express'
import createToken from '../auth/jwtToken'
import { authentication, authorization, passCallbackUrlToSession } from '../middlewares'

const router = express.Router()

router.get('/google', passCallbackUrlToSession, authentication)

router.get('/google/callback', authentication, (req, res) => {
    const { redirectUrl } = req.session
    const token = createToken(req.user)
    res.redirect(`${redirectUrl}?accessToken=${token}`)
})

router.get('/test', authorization, (req, res) => res.send('elo'))

export default router
