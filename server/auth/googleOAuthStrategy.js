import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import log from 'common/logger'
import { User, Event } from 'models'

export default new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK
}, async (accessToken, refreshToken, profile, callback) => {
    User.findOne({ 'google.googleId': profile.id })
        .then(foundUser => {
            if (!foundUser) {
                const newUser = {
                    google: {
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile._json.email,
                        photoUrl: profile._json.picture,
                        gender: profile._json.gender
                    }
                }
                return User.create(newUser)
                    .then(createdUser => {
                        log.info(`Authentication - user created - ${newUser.google.googleId}`)
                        replaceEmailWithIdForAllUsersEvents(createdUser)
                        callback(null, createdUser, 201)
                    })
                    .catch(err => {
                        log.error(`Authentication - error user created - ${newUser.google.googleId}`)
                        callback(err, null)
                    })
            }
            log.info(`Authentication - user found - ${foundUser.google.googleId}`)
            return callback(null, foundUser, 200)
        })
        .catch(err => {
            log.error('Authentication - database error')
            callback(err, null, 'Unauthenticated')
        })
})

async function replaceEmailWithIdForAllUsersEvents(user) {
    const { email } = user.google
    log.info(`Replacing email (${email}) with user id for all events where user is admin`)
    return Event.updateMany(
        { 'administrators.userId': email },
        { $set: { 'administrators.$[element].userId': user._id } },
        { arrayFilters: [{ 'element.userId': { $eq: email } }] }
    )
}
