import { Router } from "express";
const router = Router();
import { update, show, destroy, index, changeStatus } from './User.Controller.js';

router.get('/', index);
router.get('/show/:slug', show);
router.put('/update/:slug', update);
router.put('/change-status/:slug', changeStatus);
router.delete('/delete/:slug', destroy);

export default router;
