import examplesApi from './controllers/ExamplesApi'
import eventsApi from './controllers/EventsApi'

// Here we define next api sections for next controllers
export default function routes(app) {
  app.use('/api/v1/examples', examplesApi)
  app.use('/api/v1/events', eventsApi)
}
