import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import log from '../common/logger'
import { User } from '../models'

export default new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH_CALLBACK
}, async (accessToken, refreshToken, profile, callback) => {
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
            log.info(`Authentication - user created - ${newUser.googleId}`)
            callback(null, newUser, 201)
          })
          .catch(err => {
            log.error(`Authentication - error user created - ${newUser.googleId}`)
            callback(err, null)
          })
      }
      log.info(`Authentication - user found - ${foundUser.googleId}`)
      return callback(null, foundUser, 200)
    })
    .catch(err => {
      log.error('Authentication - database error')
      callback(err, null, 'Unauthenticated')
    })
})
