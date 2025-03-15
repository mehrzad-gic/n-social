import express from 'express';
import { index, show, create, update, destroy, change_status } from './CompanyMember.Controller.js';
const router = express.Router();

router.get('/', index);
router.get('/show/:id', show);
router.post('/create', create);
router.put('/update/:id', update);
router.delete('/delete/:id', destroy);
router.put('/change-status/:id', change_status);

export default router;
