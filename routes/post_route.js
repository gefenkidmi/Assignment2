const express = require("express");
const router = express.Router();
const postsController = require("../controllers/post_controller");

router.post("/newPost", postsController.newPost);

router.get("/post/:id", postsController.getPostById);

router.get("/allPosts", postsController.getAllPosts);

router.get("/post", postsController.getPostBySender);

router.put("/post/:id/content", postsController.updatePostContent);

module.exports = router;