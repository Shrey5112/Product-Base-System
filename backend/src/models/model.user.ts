import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "merchant" | "admin";
  stripeCustomerId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "merchant", "admin"], default: "customer" },
  stripeCustomerId: String,
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.model("User", UserSchema);
