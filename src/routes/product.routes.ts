import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    editProduct,
    getAllProduct,
    getBestSellers,
    getNewArrivals,
    getProductById,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// ---------------- Public Routes ----------------
// Get all products
router.get("/", getAllProduct);

// Get new arrivals
router.get("/new-arrivals", getNewArrivals);

// Get a single product by ID
router.get("/:id", getProductById);

// Get best sellers
router.get("/best-sellers", getBestSellers);

// ---------------- Protected Routes (Admin/Seller only) ----------------
// Create product
router.post("/", authMiddleware, upload.array("images", 6), createProduct);

// Edit/Update product by ID
router.put("/:id", authMiddleware, editProduct);

// Delete product by ID
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
