import { Router } from 'express';
import { index,show,deleteExpiredOtp } from './OtpController.js';
const router = Router();


router.get('/',index);
router.get('/show/:id',show);
router.delete('/delete-expired',deleteExpiredOtp);

export default router;
