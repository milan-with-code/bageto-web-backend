import { Request, Response } from "express";
import { Cart, IProduct } from "../models/cart.model";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cart = await Cart.findOne({ userId: id })
            .populate("items.productId", "name price images category");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }


        res.status(200).json({
            success: true,
            userId: cart.userId,
            totalItems: cart.items.length,
            items: cart.items.map((item) => {
                const product = item.productId as IProduct;
                return {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: Array.isArray((product as any).images) ? (product as any).images[0] : null,
                    quantity: item.quantity,
                    size: item.size || null,
                    color: item.color || null,
                    subtotal: item.quantity * product.price,
                };
            }),
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const addItemToCart = async (req: Request, res: Response) => {
    try {
        const { userId, id: productId, quantity = 1, size, color } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, size, color }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, size, color });
            }
        }

        const savedCart = await cart.save();
        await savedCart.populate("items.productId", "name price category images");

        const formattedCart = {
            userId: savedCart.userId,
            totalItems: savedCart.items.length,
            items: savedCart.items.map((item) => {
                const product = item.productId as IProduct;
                return {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: Array.isArray((product as any).images) ? (product as any).images[0] : null,
                    quantity: item.quantity,
                    size: item.size || null,
                    color: item.color || null,
                    subtotal: item.quantity * product.price
                };
            }),
            grandTotal: savedCart.items.reduce(
                (acc, item) =>
                    acc + item.quantity * ((item.productId as IProduct).price || 0),
                0
            )
        };

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart: formattedCart
        });
    } catch (error: any) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, error: error.message || "Server error" });
    }
};

export const updateCartItem = async (req: Request, res: Response) => { }

export const removeCartItem = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = (req as any).user.id;

        if (!userId || !productId) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        ).populate("items.productId", "name price category images");

        if (!updatedCart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart: {
                userId: updatedCart.userId,
                totalItems: updatedCart.items.length,
                items: updatedCart.items.map((item) => {
                    const product = item.productId as any;
                    return {
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        category: product.category,
                        image: Array.isArray(product.images) ? product.images[0] : null,
                        quantity: item.quantity,
                        size: item.size || null,
                        color: item.color || null,
                        subtotal: item.quantity * product.price
                    };
                }),
                grandTotal: updatedCart.items.reduce(
                    (acc, item) => acc + item.quantity * ((item.productId as any).price || 0),
                    0
                )
            }
        });
    } catch (error) {
        console.error("Remove Cart Item Error:", error);
        res.status(500).json({ error: "Failed to remove product from cart" });
    }
};


export const clearCart = async (req: Request, res: Response) => { }
