import { Router } from 'express';
import { create, index, show, update, destroy, changeStatus } from './Project.Controller.js';
const router = Router();

router.post('/create', create);
router.get('/', index);
router.get('/show/:slug', show);
router.put('/update/:slug', update);
router.delete('/delete/:slug', destroy);
router.put('/change-status/:slug', changeStatus);



export default router;
