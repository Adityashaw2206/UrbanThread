import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrder,
  userOrders,
  updateStatus,
  verifyStripe,
  deleteOrder
} from "../controllers/order.controller.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Stripe from "stripe";
import { Order } from "../models/order.model.js";

const orderRouter = express.Router();
//payment routes
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/place/stripe", authMiddleware, placeOrderStripe);
orderRouter.post("/place/razorpay", authMiddleware, placeOrderRazorpay);
orderRouter.get("/verify", verifyStripe);
//user features
orderRouter.get("/userOrders", authMiddleware, userOrders);
orderRouter.delete("/delete/:orderId", authMiddleware, deleteOrder);

//verify payment
// orderRouter.post('/verifyStripe',authMiddleware, verifyStripe);

//admin features
orderRouter.get("/list", adminAuthMiddleware, allOrder);
orderRouter.post("/status/:orderId", adminAuthMiddleware, updateStatus);

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);
// const orderRouter = express.Router();

// ✅ Webhook route (no auth middleware here!)
orderRouter.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }), // Stripe requires raw body
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.success_url.split("orderId=")[1];
      // ✅ Update your order in DB
      if (orderId) {
        // ✅ Update order as paid
        await Order.findByIdAndUpdate(orderId, {
          payment: true,
          status: "Paid",
        });

        const order = await Order.findById(orderId);
        if (order) {
          await Cart.findOneAndUpdate(
            { user: order.userId },
            { items: [] } // empty cart
          );
        }
      }
    }

    res.json({ received: true });
  }
);

// export default orderRouter;
export default orderRouter;
