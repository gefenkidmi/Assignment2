import express from "express";
const router = express.Router();
import postsController from "../controllers/post_controller";

router.get("/", postsController.getAllPosts);

router.get("/:id", postsController.getPostById);

router.post("/", postsController.createPost);

router.delete("/:id", postsController.deletePost);

router.put("/:id/content", postsController.updatePost);


export default router;