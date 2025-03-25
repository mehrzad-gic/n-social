import express from "express";
import PostController from "./Post.Controller.js";
const router = express.Router();
import { upload } from '../../Middlewares/uploadMiddleware.js';

router.get("", PostController.index);
router.get("/:slug/show", PostController.show);
router.get("/:slug/comments", PostController.comments);
router.post("/create", upload.array("imgs[]"), PostController.store);
router.put("/:slug/update", PostController.update);
router.patch('/:slug/change-status', PostController.change_status);
router.delete("/:slug/delete", PostController.destroy);
router.post("/like/:id", PostController.like);
// router.post("/:slug/unlike", PostController.unlike);
// router.post("/:slug/save", PostController.save);
// router.post("/:slug/remove-save", PostController.removeSave);
// router.post("/:slug/comment", PostController.addComment);
// router.post("/:slug/reply", PostController.addReply);
// router.post("/:slug/like-comment/:comment_id", PostController.likeComment);
// router.post("/:slug/unlike-comment/:comment_id", PostController.unlikeComment);



export default router;
 