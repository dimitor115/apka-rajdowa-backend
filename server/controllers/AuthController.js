import * as express from 'express'
import { authentication, authorization, passCallbackUrlToSession } from 'middlewares'
import createToken from 'auth/jwtToken'

const router = express.Router()

router.get('/auth/google', passCallbackUrlToSession, authentication)

router.get('/auth/google/callback', authentication, (req, res) => {
    const { redirectUrl } = req.session
    const token = createToken(req.user)
    res.redirect(`${redirectUrl}?accessToken=${token}`)
})

router.get('/auth/test', authorization, (req, res) => res.send(`elo${req.user}`))

export default router
