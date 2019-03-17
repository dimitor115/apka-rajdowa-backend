import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import '../common/env'
import { User } from '../models'
import log from '../common/logger'

export default new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, cb) => {
  console.log('accessToken', accessToken)
  User.findOne({ googleId: profile.id })
    .then(foundUser => {
      if (!foundUser) {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile._json.email,
          photoUrl: profile._json.picture,
          gender: profile._json.gender
        }
        return User.create(newUser)
          .then(() => {
            log.info(`User ${newUser.googleId} was created`)
            cb(null, newUser, 'User was created')
          })
          .catch(err => {
            log.error(`Problem with creating a user ${newUser.googleId}`)
            cb(err, null)
          })
      }
      log.info(`Found user ${foundUser.googleId}`)
      return cb(null, foundUser, 'User was created')
    })
    .catch(err => {
      log.error('Problem with founding a user')
      cb(err, null, 'Unauthenticated')
    })
})
