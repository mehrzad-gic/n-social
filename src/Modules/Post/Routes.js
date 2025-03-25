import express from "express";
import {index,show,store,update,destroy,changeStatus,like,comments,save} from "./Post.Controller.js";
const router = express.Router();
import { upload } from '../../Middlewares/uploadMiddleware.js';

router.get("", index);
router.get("/:slug/show", show);
router.get("/:slug/comments", comments);
router.post("/create", upload.array("imgs[]"), store);
router.put("/:slug/update", update);
router.patch('/:slug/change-status', changeStatus);
router.delete("/:slug/delete", destroy);
router.post("/like/:id", like);
router.post("/save/:id", save);
// router.post("/:slug/unlike", PostController.unlike);
// router.post("/:slug/save", PostController.save);
// router.post("/:slug/remove-save", PostController.removeSave);
// router.post("/:slug/comment", PostController.addComment);
// router.post("/:slug/reply", PostController.addReply);
// router.post("/:slug/like-comment/:comment_id", PostController.likeComment);
// router.post("/:slug/unlike-comment/:comment_id", PostController.unlikeComment);



export default router;
 