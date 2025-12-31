import { Schema, model } from "mongoose";
import { ROLES, USER_STATUS } from "../lib/constants/enums";

const UserSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.INVITED,
    },
    avatar: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    salary: {
      type: Number,
      required: false
    },
    skillSet: [{ type: String }],
    dob: {
      type: Date,
      required: false
    },
    joiningDate: {
      type: Date,
      required: false
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema)

export default User
