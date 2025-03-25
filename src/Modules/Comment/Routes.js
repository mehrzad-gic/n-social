import { Router } from "express";
import {show,index,create,reportComment,likeComment,add_reply,delete_comment,change_status} from "./Comment.Controller.js";
const router = Router();

router.get("/", index);
router.get("/show/:id", show);
router.post("/create", create);
router.post("/report/:id", reportComment);
router.post("/like/:id", likeComment);
router.post("/reply/:id", add_reply);
router.delete("/delete/:id", delete_comment);
router.put("/change-status/:id", change_status);
// router.put("/update/:id", update_comment);


export default router;
