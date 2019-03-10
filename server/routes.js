import examplesApi from './controllers/ExamplesApi';

// Here we define next api sections for next controllers
export default function routes(app) {
  app.use('/api/v1/examples', examplesApi);
}
