import * as express from 'express';
import resultHandler from '../middlewares/resultHandler';
import examplesService from '../services/ExamplesService';

const router = express.Router();

router.get('/', resultHandler(() => examplesService.all()));
router.get('/:id', resultHandler(req => examplesService.byId(req.params.id)));
router.post('/', resultHandler(req => examplesService.create(req.body.name)));

export default router;
