import { Schema, model, models } from "mongoose";

// export interface CompanyDocument extends Document {
//   email: string;
//   name?: string;
//   phone?: string;
//   address?: string;
//   industry?: string;
//   size?: string;
//   description?: string;
//   logo?: string;
//   onboardingCompleted: boolean;
//   plan: string;
//   subscriptionStatus: string;
// }

const CompanySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
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
    description: {
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

const Company = models.Company || model("Company", CompanySchema)

export default Company;
