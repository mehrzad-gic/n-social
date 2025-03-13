import express from "express";
import PostController from "./Post.Controller.js";
const router = express.Router();
import { upload } from '../../Middlewares/uploadMiddleware.js';

router.get("", PostController.index);
router.get("/:slug/show", PostController.show);
router.post("/create", upload.array("imgs[]"), PostController.store);
router.put("/:slug/update", PostController.update);
router.patch('/:slug/change-status', PostController.change_status);
router.delete("/:slug/delete", PostController.destroy);

export default router;
 