import mongoose, { Schema, model, models, Document } from "mongoose";
import { Notification } from "@/app/api/types/model";

const NotificationSchema = new Schema<Notification & Document>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ATTENDANCE", "LEAVE", "PAYROLL"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Notification ||
  model<Notification & Document>("Notification", NotificationSchema);
