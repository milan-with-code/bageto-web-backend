import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: "COD" | "Card" | "UPI";
    paymentStatus: "unpaid" | "paid" | "failed";
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String,
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        shippingAddress: {
            name: String,
            phone: String,
            address: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        paymentMethod: { type: String, enum: ["COD", "Card", "UPI"], required: true },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "failed"],
            default: "unpaid",
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
