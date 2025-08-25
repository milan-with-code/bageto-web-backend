import { Router } from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller";
import { razorpayWebhookHandler } from "../controllers/webhook.controller";

const router = Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

// webhook route - note: this route must be registered with raw body parser in server.ts
router.post("/webhook", razorpayWebhookHandler);

export default router;
