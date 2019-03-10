import * as express from 'express';
import resultHandler from '../middlewares/result-handler';
import examplesService from '../services/examples-service';

const router = express.Router();

router.get('/', resultHandler(() => examplesService.all()));
router.get('/:id', resultHandler(req => examplesService.byId(req.params.id)));
router.post('/', resultHandler(req => examplesService.create(req.body.name)));

export default router;
