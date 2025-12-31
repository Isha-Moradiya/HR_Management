import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    logo: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
    },
    address: {
      type: String
    },
    size: {
      type: Number,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ["FREE", "TRIAL", "BASIC", "PRO"],
      default: "TRIAL",
    },
    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const Company = model("Company", CompanySchema)

export default Company;
