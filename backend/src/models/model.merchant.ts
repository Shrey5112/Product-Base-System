import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMerchant extends Document {
  userId: mongoose.Types.ObjectId;
  shopName: string;
  metadata?: Record<string, any>;
}

const MerchantSchema = new Schema<IMerchant>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  shopName: { type: String, required: true },
  metadata: Object,
});

export const Merchant: Model<IMerchant> = mongoose.model("Merchant", MerchantSchema);
