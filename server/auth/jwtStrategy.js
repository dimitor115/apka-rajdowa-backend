import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import '../common/env'
import log from '../common/logger'
import { User } from '../models'

export default new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.PASSPORT_KEY
}, (jwtPayload, cb) => {
  User.findOne({ googleId: jwtPayload.user.googleId })
    .then(foundUser => {
      if (!foundUser) {
        log.error('User not found')
        return cb('User not found', null)
      }
      log.info(`Found user ${foundUser.googleId}`)
      return cb(null, foundUser, 'User was created')
    })
    .catch(err => {
      log.error('Problem with founding a user')
      cb(err, null, 'Unauthenticated')
    })
})
