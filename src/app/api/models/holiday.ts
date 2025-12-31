import mongoose, { Schema, model, models, Document } from "mongoose";
import { Holiday } from "@/app/api/types/model";

const HolidaySchema = new Schema<Holiday & Document>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Holiday ||
  model<Holiday & Document>("Holiday", HolidaySchema);
