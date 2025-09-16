import express from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Router } from "express";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WebHookRoutes = express.Router();

// Stripe requires raw body
WebHookRoutes.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderId = new URL(session.success_url).searchParams.get("orderId");
      const userId = session.client_reference_id;

      // ✅ Mark order as paid
      await Order.findByIdAndUpdate(orderId, { payment: true });

      // ✅ Clear user’s cart
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });

      console.log(`✅ Payment confirmed. Order ${orderId} marked paid & cart cleared.`);
    } catch (err) {
      console.error("⚠️ Error handling checkout.session.completed:", err.message);
    }
  }

  res.json({ received: true });
});

export default WebHookRoutes;
