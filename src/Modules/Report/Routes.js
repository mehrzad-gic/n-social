import { Router } from "express";
import ReportController from "./Report.Controller.js";

const router = Router();

router.get("/", ReportController.index);
router.get("/show/:id", ReportController.show);
router.post("/create", ReportController.create);
router.put("/update/:id", ReportController.update);
router.delete("/delete/:id", ReportController.destroy);
router.patch("/change-status/:id", ReportController.change_status);

export default router;