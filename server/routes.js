import examplesApi from './controllers/ExamplesApi'
import authController from './controllers/authController'

// Here we define next api sections for next controllers
export default function routes(app) {
  app.use('/api/v1/examples', examplesApi)
  app.use('/api/v1/auth', authController)
}
