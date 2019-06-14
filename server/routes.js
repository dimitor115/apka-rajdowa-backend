import {
    SchemasController,
    ParticipantsController,
    AuthController,
    EventsController,
    StaticController,
    AdministratorsController
} from 'controllers'

export default function routes(app) {
    app.use('/api/v1', StaticController)
    app.use('/api/v1', AuthController)
    app.use('/api/v1', SchemasController)
    app.use('/api/v1', ParticipantsController)
    app.use('/api/v1', EventsController)
    app.use('/api/v1', AdministratorsController)
}
