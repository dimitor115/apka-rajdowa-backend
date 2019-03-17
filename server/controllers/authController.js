import * as express from 'express'
import createToken from '../auth/createToken'
import { authorization, authentication } from '../middlewares'

const router = express.Router()

router.get('/google', authentication)
router.get('/google/callback', authentication, (req, res) => {
  const token = createToken(req.user)
  res.send({ token })
})
router.get('/example', authorization, (req, res) => res.status(200).send('dostalem sie'))

export default router
