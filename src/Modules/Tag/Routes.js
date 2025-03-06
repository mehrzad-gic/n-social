import express from 'express';
import { index, create, show, update, destroy, change_status } from './Tag.Controller.js';
import { validate } from '../../Middlewares/ValidationMiddleware.js';
import { tagCreateSchema, tagUpdateSchema } from './TagValidation.js';
const router = express.Router();

router.get('/tags', index);
router.post('/tags', validate(tagCreateSchema), create);
router.get('/tags/:id', show);
router.put('/tags/:id', validate(tagUpdateSchema), update);
router.delete('/tags/:id', destroy);
router.patch('/tags/:id/change-status', change_status);

export default router;