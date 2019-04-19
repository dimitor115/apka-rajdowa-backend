import Express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as os from 'os'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from '../auth/authStrategies'
import l from './logger'
import connectDb from '../db/connectDb'

const app = new Express()

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`)
    app.set('appPath', `${root}client`)
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(cookieParser(process.env.SESSION_SECRET))
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false }
    }))
    app.use(Express.static(`${root}/public`))
    app.use(cors())
    app.use(passport.initialize())
  }

  router(routes) {
    // swaggerify(app, routes);

    routes(app)
    return this
  }

  listen(port = process.env.PORT, mongoUrl = process.env.MONGO_URL) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`)
    http.createServer(app).listen(port, welcome(port))
    connectDb(mongoUrl)
    return app
  }
}
