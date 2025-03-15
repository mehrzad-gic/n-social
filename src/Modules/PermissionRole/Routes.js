import { Router } from 'express';
import { create,update } from './PermissionRole.Controller.js';
const router = Router();

router.post('/create/:id',create);
router.put('/update/:id',update);

export default router;

