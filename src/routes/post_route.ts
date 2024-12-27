import express from "express";
const router = express.Router();
import postsController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", postsController.getAll.bind(postsController));

router.get("/:id", postsController.getById.bind(postsController));

router.post("/", authMiddleware, postsController.create.bind(postsController));

router.delete(
  "/:id",
  authMiddleware,
  postsController.deleteItem.bind(postsController)
);

export default router;
