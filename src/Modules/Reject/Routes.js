import { Router } from 'express';
import { index,show,create,update,destroy,changeStatus } from './Reject.Controller.js';
const router = Router();

router.get('/',index);
router.get('/show/:slug',show);
router.post('/create',create);
router.put('/update/:slug',update);
router.delete('/delete/:slug',destroy);
router.put('/change-status/:slug',changeStatus);

export default router;

