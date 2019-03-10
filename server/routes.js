import examplesApi from './controllers/examples-api';

// Here we define next api sections for next controllers
export default function routes(app) {
  app.use('/api/v1/examples', examplesApi);
}
