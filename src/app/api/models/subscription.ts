import { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema(
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

export default models.Subscription || model("Subscription", SubscriptionSchema);
