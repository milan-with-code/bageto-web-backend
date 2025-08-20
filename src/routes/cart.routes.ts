import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addItemToCart, clearCart, getUserCart, removeCartItem, updateCartItem } from "../controllers/cart.controller";

const router = Router();

router.get("/:id", authMiddleware, getUserCart);
router.post("/", authMiddleware, addItemToCart);
router.put("/", authMiddleware, updateCartItem);
router.delete("/:productId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;
