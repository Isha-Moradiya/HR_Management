import mongoose, { Schema, model, models, Document } from "mongoose";
import { LeaveType } from "@/app/api/types/model";

const LeaveTypeSchema = new Schema<LeaveType & Document>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    yearlyLimit: {
      type: Number
    },
    maxDaysPerYear: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.LeaveType ||
  model<LeaveType & Document>("LeaveType", LeaveTypeSchema);
