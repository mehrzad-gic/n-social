import { Router } from 'express';
import { index,show,create,reject } from './GroupAdmin.Controller.js';
const router = Router();


router.get('/',index);
router.get('/show/:id',show);
router.post('/create',create);
router.put('/reject/:id',reject);


export default router;


