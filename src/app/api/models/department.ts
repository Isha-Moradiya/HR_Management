import { Schema, models, model } from "mongoose";
import { DEPARTMENT_STATUS } from "../lib/constants/enums";

const DepartmentSchema = new Schema(
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
      enum: Object.values(DEPARTMENT_STATUS),
      default: DEPARTMENT_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

const Department = models.Department || model("Department", DepartmentSchema);

export default Department