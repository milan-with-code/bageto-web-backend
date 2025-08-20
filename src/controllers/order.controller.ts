import { Request, Response } from "express";
import { Order } from "../models/order.model";

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
