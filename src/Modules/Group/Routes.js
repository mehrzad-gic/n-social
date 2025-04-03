import { Router } from 'express';
import { index, create, update, destroy, show, change_status, posts, members } from './Group.Controller.js';
import { upload } from '../../Middlewares/uploadMiddleware.js';
const router = Router();


router.get('/',index);
router.post('/create',upload.single('img'),create);
router.put('/update/:slug',upload.single('img'),update);
router.delete('/delete/:slug',destroy);
router.get('/show/:slug',show);
router.put('/change-status/:slug',change_status);
router.get('/posts/:slug',posts);
router.get('/members/:slug',members);
router.post('/add-member/:slug',add_member);
router.post('/remove-member/:slug',remove_member);


export default router;
