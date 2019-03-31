import {
    SchemasController,
    FormsController,
    authController
} from './controllers'

export default function routes(app) {
    app.use('/api/v1/auth', authController)
    app.use('/api/v1/schemas', SchemasController)
    app.use('/api/v1/event/data', FormsController)
}
