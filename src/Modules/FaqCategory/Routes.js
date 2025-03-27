import { Router } from "express";
import FaqCategoryController from "./FaqCategory.Controller.js";
const router = Router();


router.get('/', FaqCategoryController.index);
router.get('/show/:slug', FaqCategoryController.show);
router.post('/create', FaqCategoryController.create);
router.put('/update/:slug', FaqCategoryController.update);
router.delete('/delete/:slug', FaqCategoryController.destroy);
router.put('/change-status/:slug', FaqCategoryController.change_status);

export default router;
