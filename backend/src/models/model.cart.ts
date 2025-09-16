// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface ICartItem {
//   type: "product" | "course";
//   itemId: mongoose.Types.ObjectId;
//   quantity: number;
//   priceSnapshot: number;
// }

// export interface ICart extends Document {
//   userId: mongoose.Types.ObjectId;
//   items: ICartItem[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CartItemSchema = new Schema<ICartItem>(
//   {
//     type: { type: String, enum: ["product", "course"], required: true },
//     itemId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       refPath: "items.type", // ✅ dynamically reference 'Product' or 'Course'
//     },
//     quantity: { type: Number, default: 1 },
//     priceSnapshot: { type: Number, required: true },
//   },
//   { _id: false } // prevent generating separate _id for each subdocument
// );

// const CartSchema = new Schema<ICart>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
//     items: [CartItemSchema],
//   },
//   { timestamps: true } // ✅ adds createdAt & updatedAt
// );

// export const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);
