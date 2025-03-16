import { Router } from "express";
import { create, index, show, destroy } from "./PostReport.Controller";
import { authMiddleware } from "../../Middleware/AuthMiddleware";
const router = Router();

router.post("/create/:id", authMiddleware, create);
router.get("/", authMiddleware, index);
router.get("/show/:id", authMiddleware, show);
router.delete("/delete/:id", authMiddleware, destroy);

export default router;



