import { Router } from "express";
const router = Router();
import { update, show, destroy, index, changeStatus, create } from './User.Controller.js';
import { upload } from "../../Middlewares/uploadMiddleware.js";

router.get('/', index);
router.post('/create', create);
router.get('/show/:slug', show);
router.put('/update/:slug', upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'img_bg', maxCount: 1 }
]), update);
router.put('/change-status/:slug', changeStatus);
router.delete('/delete/:slug', destroy);

export default router;
