import { Router } from "express";
import { getUsers, loginUser, createUser, logoutUser, getMe } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/me", getMe)
router.post("/login", loginUser)
router.post("/register", createUser)
router.post("/logout", logoutUser)
router.post("/register", createUser)

export default router;
