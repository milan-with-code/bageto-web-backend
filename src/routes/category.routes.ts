import express from "express";
import {
    createCategory,
    getCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// ---------------- Public APIs ----------------
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// ---------------- Admin APIs (Protected) ----------------
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
