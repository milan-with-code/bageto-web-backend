import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    orderId: mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    userId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: "created" | "paid" | "failed" | "refunded";
    method?: string;
    email?: string;
    contact?: string;
    notes?: Record<string, any>;
    webhookEventId?: string;
    webhookEventType?: string;
    webhookPayload?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        status: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created",
        },
        method: { type: String },
        email: { type: String },
        contact: { type: String },
        notes: { type: Schema.Types.Mixed },

        webhookEventId: { type: String },
        webhookEventType: { type: String },
        webhookPayload: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
