import { Router } from "express";
import CommentController from "./Comment.Controller.js";
const router = Router();

router.get("/", CommentController.index);
router.get("/show/:id", CommentController.show);
router.post("/create", CommentController.create);
router.post("/report/:id", CommentController.reportComment);
router.post("/like/:id", CommentController.likeComment);
router.post("/unlike/:id", CommentController.unlikeComment);
router.post("/reply/:id", CommentController.add_reply);
router.delete("/delete/:id", CommentController.delete_comment);
router.put("/change-status/:id", CommentController.change_status);
router.put("/update/:id", CommentController.update_comment);


export default router;
