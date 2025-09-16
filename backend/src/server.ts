import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

import productRoutes from "./routes/route.product";
import courseRoutes from "./routes/route.course";
import merchantRoutes from "./routes/route.merchant";
import authRoutes from "./routes/route.user";
import webhookRoutes from "./routes/routes.webhook"

// ✅ Load env variables before using them
dotenv.config();

const app: Application = express();

// ✅ Middlewares first
// app.use(express.json());
app.use(
  express.json({
    verify: (req: any, buf) => {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf; // attach raw buffer for Stripe
      }
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/courses", courseRoutes);
app.use("/merchant", merchantRoutes);
app.use("/webhook", webhookRoutes)

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
