import * as express from 'express'
import createToken from '../auth/jwtToken'
import { authentication, authorization } from '../middlewares'

const router = express.Router()

router.get('/google', authentication)

router.get('/google/callback', authentication, (req, res) => {
  const token = createToken(req.user)
  // eslint-disable-next-line max-len
  // TODO: Na razie zahardkodowane trzeba by było zrobić to jako parametr 'redirect' z frontu czy coś takiego
  // Swoją drogą ta strategia korzysta z google+ xD
  res.redirect(`http://localhost:3000/login?token=${token}`)
})

router.get('/test', authorization, (req, res) => res.send('elo'))

export default router
