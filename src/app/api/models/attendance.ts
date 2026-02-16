import { Attendance } from "@/app/api/types/model";
import mongoose, { Schema, models, model, Document } from "mongoose";

const AttendanceSchema = new Schema<Attendance & Document>(
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
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "leave"],
      required: true,
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default models.Attendance ||
  model<Attendance & Document>("Attendance", AttendanceSchema);
