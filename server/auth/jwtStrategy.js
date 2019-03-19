import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import '../common/env'
import log from '../common/logger'
import { User } from '../models'

export default new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.PASSPORT_KEY
}, (jwtPayload, callback) => {
  User.findOne({ googleId: jwtPayload.user.googleId })
    .then(foundUser => {
      if (!foundUser) {
        log.error('Authorization - user not found')
        return callback(null, null, 'Unauthorized')
      }
      log.info(`'Authorization - user' ${foundUser.googleId} created`)
      return callback(null, foundUser, `Authorization - user ${foundUser.googleId} created`)
    })
    .catch(err => {
      log.error('Authorization - database error')
      callback(err, null, 'Unauthorized')
    })
})
