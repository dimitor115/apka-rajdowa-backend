import passport from 'passport'

export default passport.authenticate('google', { scope: ['profile', 'email'], session: false })
