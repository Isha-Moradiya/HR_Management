import mongoose, { Schema, model, models, Document } from "mongoose";
import { Subscription } from "@/app/api/types/model";

const SubscriptionSchema = new Schema<Subscription & Document>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["STRIPE", "RAZORPAY"],
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Subscription ||
  model<Subscription & Document>("Subscription", SubscriptionSchema);
