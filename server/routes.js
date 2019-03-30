import {
    SchemasController,
    // EventDataController,
    authController
    // ExamplesApi
} from './controllers'


// Here we define next api sections for next controllers
export default function routes(app) {
    // app.use('/api/v1/examples', ExamplesApi)
    app.use('/api/v1/auth', authController)
    app.use('/api/v1/schemas', SchemasController)
    // app.use('/api/v1/event/data', EventDataController)
}
