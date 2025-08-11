import { Router } from "express";
import { getUsers, loginUser, createUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.post("/login", loginUser)
router.post("/register", createUser)

export default router;
