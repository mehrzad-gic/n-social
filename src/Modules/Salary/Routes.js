import { Router } from 'express';
import { index,create,update,destroy,show,changeStatus } from './Salary.Controller.js';

const router = Router();

router.get('/',index);
router.post('/create',create);
router.put('/update/:id',update);
router.delete('/delete/:id',destroy);
router.get('/show/:id',show);
router.put('/change-status/:id',changeStatus);

export default router;
