import { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import { Payment } from "../models/payment.model";
import { Order } from "../models/order.model";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export const razorpayWebhookHandler = async (req: Request, res: Response) => {
    try {
        const signature = req.headers["x-razorpay-signature"] as string | undefined;
        const rawBody = (req as any).rawBody as Buffer | undefined;

        if (!signature || !rawBody) {
            return res.status(400).send("Missing signature or raw body");
        }

        const expectedSignature = crypto
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.warn("Webhook signature mismatch");
            return res.status(400).send("Invalid signature");
        }

        const event = req.body; // parsed JSON
        // event.entity === "event"
        const eventType = event.event;
        const createdAt = event.created_at;

        // try to extract payment entity if present
        let entityId: string | undefined;
        if (event.payload?.payment?.entity?.id) {
            entityId = event.payload.payment.entity.id;
        } else if (event.payload?.refund?.entity?.id) {
            entityId = event.payload.refund.entity.id;
        }

        // Upsert or log the event in Payment doc by matching razorpayOrderId or razorpayPaymentId
        const payload = event.payload || {};

        // If payment exists, update Payment doc
        if (entityId) {
            // Try to find payment by razorpayPaymentId OR by razorpayOrderId present in payload
            const rpPayment = event.payload?.payment?.entity;
            const rpOrderId = rpPayment?.order_id;

            let paymentDoc = null;
            if (rpPayment?.id) {
                paymentDoc = await Payment.findOne({ razorpayPaymentId: rpPayment.id });
            }
            if (!paymentDoc && rpOrderId) {
                paymentDoc = await Payment.findOne({ razorpayOrderId: rpOrderId });
            }

            // Update webhook fields and map status
            if (paymentDoc) {
                const newStatus =
                    rpPayment?.status === "captured" || rpPayment?.status === "authorized" ? "paid" : rpPayment?.status === "failed" ? "failed" : paymentDoc.status;

                paymentDoc.webhookEventId = entityId;
                paymentDoc.webhookEventType = eventType;
                paymentDoc.webhookPayload = payload;
                paymentDoc.status = newStatus;
                if (rpPayment?.id) paymentDoc.razorpayPaymentId = rpPayment.id;
                await paymentDoc.save();

                // Also update Order based on status
                if (newStatus === "paid") {
                    await Order.findByIdAndUpdate(paymentDoc.orderId, { paymentStatus: "paid", status: "paid" });
                } else if (newStatus === "failed") {
                    await Order.findByIdAndUpdate(paymentDoc.orderId, { paymentStatus: "failed", status: "pending" });
                }
            } else {
                // no paymentDoc found - optionally log (you may want separate collection for webhook logs)
                console.warn("Webhook: Payment doc not found for", { rpOrderId, entityId });
            }
        } else {
            // other events (refunds, disputes etc.) -> you can store in separate collection or handle similarly
            console.log("Unhandled webhook event, type:", eventType);
        }

        // respond 200 quickly
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("webhook error:", err);
        return res.status(500).send("Server error");
    }
};
