import { Router } from "express";
import EmailController from "./Email.Controller.js";
const router = Router();


router.get('/', EmailController.index);
router.get('/show/:id', EmailController.show);
router.post('/create', EmailController.create);
router.put('/update/:id', EmailController.update);
router.delete('/delete/:id', EmailController.destroy);
router.put('/status/:id', EmailController.change_status);

export default router;
