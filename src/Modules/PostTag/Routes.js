import { Router } from "express";
import { post_tags, tag_posts, clear } from "./PostTag.Controller";
const router = Router();

router.post("/post-tags/:id", post_tags);
router.get("/tag-posts/:id", tag_posts);
router.delete("/clear/:id", clear);

export default router;

