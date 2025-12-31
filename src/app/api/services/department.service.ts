import department from "../models/department";
import { Department } from "../types/model";
import mongoose from "mongoose";

export const createDepartment = async (data: Partial<Department>) => {
  return await department.create(data);
};

export const getAllDepartments = async () => {
  return await department.find().sort({ createdAt: -1 });
};

export const getDepartmentById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }
  return await department.findById(id);
};

export const updateDepartment = async (
  id: string,
  data: Partial<Department>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }
  return await department.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDepartment = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }
  return await department.findByIdAndDelete(id);
};
