import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

router.post("/register", usersController.register);

router.post("/login", usersController.login);

router.post("/refresh", usersController.refresh);

router.post("/logout", usersController.logout);

export default router;
