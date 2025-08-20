import { Router } from "express";
import {
    getUsers,
    loginUser,
    createUser,
    logoutUser,
    getMe
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get all users (admin protected)
router.get("/", authMiddleware, getUsers);

// Get current logged-in user
router.get("/me", authMiddleware, getMe);

// Register new user
router.post("/register", createUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

export default router;
