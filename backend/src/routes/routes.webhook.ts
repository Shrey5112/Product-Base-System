// import express from "express";
// import bodyParser from "body-parser";
// import { handleStripeWebhook } from "../controllers/controller.webhook";


// const router = express.Router();

// // Stripe requires raw body for webhook
// router.post(
//   "/",
//   bodyParser.raw({ type: "application/json" }),
//   handleStripeWebhook
// );

// export default router;


import express from "express";
import bodyParser from "body-parser";
import { handleStripeWebhook } from "../controllers/controller.webhook";

const router = express.Router();

// Stripe webhook expects raw body
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
