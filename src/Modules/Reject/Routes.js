import { Router } from 'express';
import { index,show,create,update,destroy,changeStatus } from './Reject.Controller.js';
const router = Router();

router.get('/',index);
router.get('/show/:id',show);
router.post('/create',create);
router.put('/update/:id',update);
router.delete('/delete/:id',destroy);
router.put('/change-status/:id',changeStatus);

export default router;

