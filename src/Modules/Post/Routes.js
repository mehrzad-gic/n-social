import express from "express";
import PostController from "./Post.Controller.js";

const router = express.Router();

router.get("/posts", PostController.index);
router.get("/posts/:slug/show", PostController.show);
router.post("/posts/create", PostController.store);
router.put("/posts/:slug/update", PostController.update);
router.patch('/posts/:slug/change-status', PostController.change_status);
router.delete("posts/:slug/delete", PostController.destroy);
