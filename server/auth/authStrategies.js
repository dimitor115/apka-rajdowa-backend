import passport from 'passport'
import googleStategy from './googleOAuthStrategy'
import jwtStrategy from './jwtStrategy'

passport.use(googleStategy)
passport.use(jwtStrategy)

export default passport
