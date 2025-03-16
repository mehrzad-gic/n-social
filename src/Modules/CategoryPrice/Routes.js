import { Router } from "express";
import { create, update, show, index, destroy, changeStatus } from "./CategoryPrice.Controller";
const router = Router();


router.post("/create/:id", create);
router.put("/update/:id", update);
router.get("/show/:id", show);
router.get("/", index);
router.delete("/delete/:id", destroy);
router.put("/change-status/:id", changeStatus);

export default router;
