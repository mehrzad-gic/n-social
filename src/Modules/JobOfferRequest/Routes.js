import { Router } from 'express';
import { index, create, show, answer } from './JobOfferRequest.Controller.js';
const router = Router();

router.get('/',index);
router.post('/create',create);
router.get('/show/:id',show);
router.post('/answer/:id',answer);

export default router;

