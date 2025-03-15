import { Router } from 'express';
import { create,index,show,update,destroy,changeStatus } from './Permission.Controller.js';
const router = Router();

router.post('/create',create);
router.get('/',index);
router.get('/show/:id',show);
router.put('/update/:id',update);
router.delete('/delete/:id',destroy);
router.put('/change-status/:id',changeStatus);

export default router;

