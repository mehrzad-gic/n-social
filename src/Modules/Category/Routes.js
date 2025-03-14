import { Router } from "express";
import { CategoryController } from "./Category.Controller.js";
const router = Router();


router.get('/',CategoryController.index);
router.post('/',CategoryController.create);
router.put('/:id',CategoryController.update);
router.delete('/:id',CategoryController.destroy);
router.get('/:id',CategoryController.show);
router.put('/:id/status',CategoryController.change_status);

export default router;
