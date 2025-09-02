import { Response } from "express";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user.favorites });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
}


export const addToFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.favorites.includes(productId)) {
            return res.status(400).json({ message: "Already in favorites" });
        }
        user.favorites.push(productId);
        await user.save();
        res.json({ message: "Added to favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || "Added to favorites failed" });
    }
}


export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.favorites.includes(productId)) {
            return res.status(400).json({ message: "Product not in favorites" });
        }
        user.favorites = user.favorites.filter(favId => favId.toString() !== productId);
        await user.save();
        res.json({ message: "Removed from favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
