import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    price: number;
    category: string;
    images: string[];
}

export interface ICartItem {
    productId: mongoose.Types.ObjectId | IProduct;
    quantity: number;
    size?: string;
    color?: string;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    size: { type: String },
    color: { type: String },
});

const cartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
