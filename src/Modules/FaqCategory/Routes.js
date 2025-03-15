import { Router } from "express";
import FaqCategoryController from "./FaqCategory.Controller.js";
const router = Router();


router.get('/', FaqCategoryController.index);
router.get('/show/:id', FaqCategoryController.show);
router.post('/create', FaqCategoryController.create);
router.put('/update/:id', FaqCategoryController.update);
router.delete('/delete/:id', FaqCategoryController.destroy);
router.put('/change-status/:id', FaqCategoryController.change_status);

export default router;
