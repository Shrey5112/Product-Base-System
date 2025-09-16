import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  merchantId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  stripePriceId?: string;
  cart: { userId: mongoose.Types.ObjectId; quantity: number }[]; // track users
  thumbnail ?: string;
  isActive: boolean;
}

const CourseSchema = new Schema<ICourse>({
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "inr" },
  interval: { type: String, enum: ["month", "year"], default: "month" },
  thumbnail : { type: String, default: "" },
  cart: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      quantity: { type: Number, default: 1 },
    },
  ],
  stripePriceId: String,
  isActive: { type: Boolean, default: true },
});

export const Course: Model<ICourse> = mongoose.model("Course", CourseSchema);
