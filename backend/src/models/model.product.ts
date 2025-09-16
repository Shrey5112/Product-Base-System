import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  merchantId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  quantity?: number; // ✅ optional total quantity field if needed
  images?: string[];
  isActive: boolean;
  metadata?: Record<string, any>;
  cart: { userId: mongoose.Types.ObjectId; quantity: number }[]; // track users and their cart quantity
}

const ProductSchema = new Schema<IProduct>({
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "inr" },
  stock: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 }, // ✅ total product quantity
  images: { type: [String], default: [] },
  cart: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      quantity: { type: Number, default: 1 },
    },
  ],
  isActive: { type: Boolean, default: true },
  metadata: Object,
});

export const Product: Model<IProduct> = mongoose.model("Product", ProductSchema);
