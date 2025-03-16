import { Router } from 'express';
import { createSkill, update, destroy, show, changeStatus } from './Skill.Controller.js';
const router = Router();


router.post('/create', createSkill);
router.put('/update/:id', update);
router.delete('/destroy/:id', destroy);
router.get('/show/:id', show);
router.put('/change-status/:id', changeStatus);

export default router;

