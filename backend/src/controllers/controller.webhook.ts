import dotenv from "dotenv";
import Stripe from "stripe";
import { Request, Response } from "express";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// Webhook handler
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).body, // raw body required
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // First subscription payment
      case "checkout.session.completed":
        {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("✅ Subscription created for:", session.customer_email);
          // TODO: Add subscription to user's courses in DB
        }
        break;

      // Recurring subscription payments
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        console.log(
          "💰 Payment succeeded for subscription:",
          // invoice.subscription
        );
        // TODO: Update subscription status in DB
        break;
      }

      default:
        console.log(`⚡ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("🔥 Error handling webhook event:", err.message);
    res.status(500).send("Webhook handler failed");
  }
};
