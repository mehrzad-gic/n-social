import { Router } from "express";
import CompanyController from "./Company.Controller.js";
const router = Router();


router.get('/', CompanyController.index);
router.get('/show/:id', CompanyController.show);
router.post('/create', CompanyController.create);
router.put('/update/:id', CompanyController.update);
router.delete('/delete/:id', CompanyController.destroy);
router.put('/status/:id', CompanyController.change_status);


export default router;
