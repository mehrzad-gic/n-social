import express from 'express';
import { register, login, sendOTP, checkOTP, resetPassword } from './Auth.Controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/check-otp', checkOTP);
router.post('/reset-password', resetPassword);

export default router;