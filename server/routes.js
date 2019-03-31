import {
    SchemasController,
    FormsController,
    AuthController
} from './controllers'

export default function routes(app) {
    app.use('/api/v1/auth', AuthController)
    app.use('/api/v1/schemas', SchemasController)
    app.use('/api/v1/event/data', FormsController)
}
