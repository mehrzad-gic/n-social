import { Router } from "express";
import { index,store,unDo } from "./PostReaction.Controller";
const router = Router();

router.get("/", index);
router.post("/store", store);
router.post("/unDo/:id", unDo);

export default router;