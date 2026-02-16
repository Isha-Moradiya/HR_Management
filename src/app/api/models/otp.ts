import { Otp } from "@/app/api/types/model";
import { model, Schema, Document, models } from "mongoose";

const OtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otpCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default models.Otp || model("Otp", OtpSchema);
