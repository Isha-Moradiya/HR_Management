import { Department } from "@/app/api/types/model";
import mongoose, { Schema, models, model, Document } from "mongoose";

const DepartmentSchema = new Schema<Department & Document>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    department_name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default models.Department ||
  model<Department & Document>("Department", DepartmentSchema);
