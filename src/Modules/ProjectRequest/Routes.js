import { Router } from 'express';
import { create, index, show, accept, reject } from './ProjectRequest.Controller.js';
const router = Router();

router.post('/create/:slug', create);
router.get('/', index);
router.get('/:id', show);
router.put('/accept/:id', accept);
router.put('/reject/:id', reject);

export default router;


