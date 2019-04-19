import passport from 'passport'

export default passport.authenticate('google', { scope: ['profile', 'email'], session: false })

export const passCallbackUrlToSession = (req, res, next) => {
    req.session.redirectUrl = req.query.callback || process.env.GOOGLE_AUTH_FRONTEND_CALLBACK
    return next()
}
