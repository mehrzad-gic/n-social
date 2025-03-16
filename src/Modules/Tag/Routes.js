import express from 'express';
import { index, create, show, update, destroy, changeStatus, tag_posts } from './Tag.Controller.js';
const router = express.Router();

router.get('/', index);
router.post('/create', create);
router.get('/show/:slug', show);
router.put('/update/:slug', update);
router.delete('/delete/:slug', destroy);
router.patch('/change-status/:slug', changeStatus);
router.get('/posts/:slug', tag_posts);

export default router;