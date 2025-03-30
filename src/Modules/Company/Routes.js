import { Router } from "express";
import {index, update, change_status, show, create, destroy, report} from "./Company.Controller.js";
const router = Router();


router.get('/', index);
router.get('/show/:slug', show);
router.post('/create', create);
router.put('/update/:slug', update);
router.delete('/delete/:slug', destroy);
router.put('/change-status/:slug', change_status);
router.post('/report/:slug', report);

export default router;
