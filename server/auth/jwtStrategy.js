import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import log from '../common/logger'
import { User } from '../models'

export default new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.PASSPORT_KEY
}, (jwtPayload, callback) => {
    User.findOne({ _id: jwtPayload.user.id })
        .then(foundUser => {
            if (!foundUser) {
                log.error('Authorization - user not found')
                return callback(null, null, 'Unauthorized')
            }
            log.info(`'Authorization - user' ${foundUser.google.googleId} created`)
            return callback(null, foundUser, `Authorization - user ${foundUser.google.googleId} created`)
        })
        .catch(err => {
            log.error('Authorization - database error')
            callback(err, null, 'Unauthorized')
        })
})
