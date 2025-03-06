import express from 'express';
import { register, login, sendOTP, checkOTP, resetPassword, confirmResetPassword, verify_token } from './Auth.Controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/check-otp', checkOTP);
router.post('/reset-password', resetPassword);
router.post('/confirm-reset-password', confirmResetPassword); // Add the confirm reset password route
router.post('/verify-token', verify_token); // Add the confirm reset password route

export default router;