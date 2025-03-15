import { Router } from 'express';
import { index, create, update, destroy, change_status, show } from './JobOffer.Controller.js';
const router = Router();

router.get('/',index);
router.post('/create',create);
router.put('/update/:id',update);
router.delete('/destroy/:id',destroy);
router.put('/change-status/:id',change_status);
router.get('/show/:id',show);

export default router;

