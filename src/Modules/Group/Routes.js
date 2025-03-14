import { Router } from 'express';
import GroupController from './Group.Controller.js';
const router = Router();


router.get('/',GroupController.index);
router.post('/create',GroupController.create);
router.put('/update/:id',GroupController.update);
router.delete('/delete/:id',GroupController.destroy);
router.get('/show/:id',GroupController.show);
router.put('/status/:id',GroupController.change_status);


export default router;
