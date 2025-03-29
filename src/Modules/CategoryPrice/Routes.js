import { Router } from "express";
import { create, update, show, index, destroy, changeStatus } from "./CategoryPrice.Controller.js";
const router = Router();


router.post("/create/:category", create);
router.put("/update/:id", update);
router.get("/show/:id", show);
router.get("/:category", index);
router.delete("/delete/:id", destroy);
router.put("/change-status/:id", changeStatus);

export default router;
