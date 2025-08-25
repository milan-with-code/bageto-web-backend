import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

/**
 * Create Razorpay order and save Payment doc
 * Expects: req.body = { orderId: "<your Order _id>" }
 */
export const createRazorpayOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        // For testing, ignore DB fetch
        const dummyOrder = {
            _id: "66ce3f3e8f9b8f1a1c3f0001", // fake ObjectId
            userId: "66ce3f3e8f9b8f1a1c3f0002", // fake userId
            totalAmount: 500, // Rs. 500
        };

        const amountInPaise = Math.round(dummyOrder.totalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `rcpt_${orderId}_${Date.now()}`,
            payment_capture: 1,
            notes: { orderId },
        };

        // Create Razorpay Order
        const rOrder = await razorpay.orders.create(options);

        // Save payment in DB (optional in testing)
        const payment = await Payment.create({
            orderId: dummyOrder._id,
            razorpayOrderId: rOrder.id,
            userId: dummyOrder.userId,
            amount: amountInPaise,
            currency: options.currency,
            status: "created",
            notes: options.notes,
        });

        return res.json({
            success: true,
            order: rOrder,
            paymentId: payment._id,
        });
    } catch (err) {
        console.error("createRazorpayOrder error:", err);
        return res.status(500).json({ message: "Server error", error: err });
    }
};

/**
 * Verify payment coming from frontend after checkout
 * Expects: req.body = { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId (our payment doc id) }
 */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        // compute signature
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            // signature mismatch: possible tampering
            await Payment.findByIdAndUpdate(paymentId, {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "failed",
            });
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // signature valid -> update payment and order
        const payment = await Payment.findOneAndUpdate(
            { _id: paymentId },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "paid",
            },
            { new: true }
        );

        // update order payment status too
        await Order.findByIdAndUpdate(payment!.orderId, {
            paymentStatus: "paid",
            status: "paid",
        });

        return res.json({ success: true, message: "Payment verified", payment });
    } catch (err) {
        console.error("verifyPayment error:", err);
        return res.status(500).json({ message: "Server error", error: err });
    }
};
