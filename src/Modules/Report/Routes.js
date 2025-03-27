import { Router } from "express";
import {index,change_status,create,update,show,destroy} from "./Report.Controller.js";

const router = Router();

router.get("/", index);
router.get("/show/:slug", show);
router.post("/create", create);
router.put("/update/:slug", update);
router.delete("/delete/:slug", destroy);
router.put("/change-status/:slug", change_status);

export default router;