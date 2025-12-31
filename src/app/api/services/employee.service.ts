import UserModel from "../models/user";
import { User } from "../types/model";
import mongoose from "mongoose";

export async function createEmployee(data: Partial<User>) {
  return await UserModel.create(data);
}

export async function getEmployees(filters: any = {}) {
  return await UserModel.find(filters).populate("department");
}

export async function getEmployeeById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await UserModel.findById(id).populate("department");
}

export async function updateEmployee(id: string, data: Partial<User>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteEmployee(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await UserModel.findByIdAndDelete(id);
}

export function getSkillSetOptions() {
  return ["JavaScript", "Python", "Java", "React", "Node.js"];
}
