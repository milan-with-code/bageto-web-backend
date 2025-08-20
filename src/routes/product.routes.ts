import { Router } from "express";
import { createProduct, deleteProduct, editProduct, getAllProduct, getProductById } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Get all products
router.get("/", getAllProduct);

// Get a single product by ID
router.get("/:id", getProductById);

// Create product
router.post("/", authMiddleware, upload.array("images", 6), createProduct);

// Edit/Update product by ID
router.put("/:id", editProduct);

// Delete product by ID
router.delete("/:id", deleteProduct);


export default router;
