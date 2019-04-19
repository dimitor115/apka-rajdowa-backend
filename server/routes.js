import {
    SchemasController,
    ParticipantsController,
    AuthController,
    EventsController
} from './controllers'

export default function routes(app) {
    app.use('/api/v1/auth', AuthController)
    app.use('/api/v1/schemas', SchemasController)
    app.use('/api/v1/event/participants', ParticipantsController)
    app.use('/api/v1/event', EventsController)
}
