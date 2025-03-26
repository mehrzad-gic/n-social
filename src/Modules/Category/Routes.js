import { Router } from "express";
import { index, create, update, destroy, show, change_status } from "./Category.Controller.js";
const router = Router();


router.get('/',index);
router.post('/create',create);
router.put('/update/:slug',update);
router.delete('/delete/:slug',destroy); 
router.get('/show/:slug',show);
router.put('/change-status/:slug',change_status);

export default router;
