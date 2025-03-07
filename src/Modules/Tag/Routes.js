import express from 'express';
import { index, create, show, update, destroy, changeStatus } from './Tag.Controller.js';
const router = express.Router();

router.get('/tags', index);
router.post('/tags', create);
router.get('/tags/:slug', show);
router.put('/tags/:slug', update);
router.delete('/tags/:id', destroy);
router.patch('/tags/:slug/change-status', changeStatus);

export default router;