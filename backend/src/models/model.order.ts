// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IOrderItem {
//   itemType: string;
//   itemId: mongoose.Types.ObjectId;
//   qty: number;
//   unitPrice: number;
// }

// export interface IOrder extends Document {
//   userId: mongoose.Types.ObjectId;
//   items: IOrderItem[];
//   totalAmount: number;
//   currency: string;
//   status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
//   paymentIntentId?: string;
//   merchantIds: mongoose.Types.ObjectId[];
//   createdAt: Date;
// }

// const OrderSchema = new Schema<IOrder>({
//   userId: { type: Schema.Types.ObjectId, ref: "User" },
//   items: [
//     {
//       itemType: String,
//       itemId: Schema.Types.ObjectId,
//       qty: Number,
//       unitPrice: Number,
//     },
//   ],
//   totalAmount: Number,
//   currency: String,
//   status: {
//     type: String,
//     enum: ["pending", "paid", "failed", "cancelled", "refunded"],
//     default: "pending",
//   },
//   paymentIntentId: String,
//   merchantIds: [Schema.Types.ObjectId],
//   createdAt: { type: Date, default: Date.now },
// });

// export const Order: Model<IOrder> = mongoose.model("Order", OrderSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  type: "product" | "course";
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // snapshot at purchase
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "failed";
  paymentIntentId?: string;
  checkoutSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    type: { type: String, enum: ["product", "course"], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  // { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paymentIntentId: { type: String },
    checkoutSessionId: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.model("Order", orderSchema);
