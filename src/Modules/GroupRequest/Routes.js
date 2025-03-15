import { Router } from 'express';
import { index,show,create,answer } from './GroupAdmin.Controller.js';
const router = Router();


router.get('/',index);
router.get('/show/:id',show);
router.post('/create',create);
router.put('/answer/:id',answer);


export default router;


