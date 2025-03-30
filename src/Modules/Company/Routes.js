import { Router } from "express";
import CompanyController from "./Company.Controller.js";
const router = Router();


router.get('/', CompanyController.index);
router.get('/show/:slug', CompanyController.show);
router.post('/create', CompanyController.create);
router.put('/update/:slug', CompanyController.update);
router.delete('/delete/:slug', CompanyController.destroy);
router.put('/change-status/:slug', CompanyController.change_status);
router.post('/report/:slug', CompanyController.report);

export default router;
