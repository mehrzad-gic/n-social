import { Router } from 'express';
import { create, index, show, destroy, changeStatus } from './ProjectReport.Controller.js';
const router = Router();

router.post('/create/:slug', create);
router.get('/', index);
router.get('/show/:id', show);
router.delete('/delete/:id', destroy);
router.put('/change-status/:id', changeStatus);

export default router;

