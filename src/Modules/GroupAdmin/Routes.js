import { Router } from 'express';
import GroupAdminController from './GroupAdmin.Controller.js';
const router = Router();


router.get('/',GroupAdminController.index);
router.post('/create',GroupAdminController.create);
router.put('/update/:id',GroupAdminController.update);
router.delete('/delete/:id',GroupAdminController.destroy);
router.get('/show/:id',GroupAdminController.show);
router.put('/status/:id',GroupAdminController.change_status);
router.get('/group-admins/:id',GroupAdminController.get_group_admins);
router.put('/type/:id',GroupAdminController.change_type);


export default router;
