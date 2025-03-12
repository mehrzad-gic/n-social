import express from 'express';
import TestController from './Test.Controller.js';
import { upload } from '../../Middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/test/upload', upload.single('image'), TestController.uploadImage); // Use upload middleware

export default router;