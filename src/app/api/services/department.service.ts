import Department from "../models/department";
import mongoose from "mongoose";
import { DEPARTMENT_STATUS } from "../lib/constants/enums";

interface CreateDepartmentProps {
  companyId: string;
  department_name: string;
  logo?: string;
  status?: string;
}

interface UpdateDepartmentProps {
  department_name?: string;
  logo?: string;
  status?: string;
}

// Get Department by ID
export const getDepartmentById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }

  const department = await Department.findById(id).populate(
    "companyId",
    "companyName email"
  );

  if (!department) throw new Error("Department not found");

  return department;
};

// Get All Departments (Company scoped + pagination)
export const getAllDepartments = async ({
  companyId,
  page = 1,
  limit = 10,
}: {
  companyId: string;
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const [departments, total] = await Promise.all([
    Department.find({ companyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Department.countDocuments({ companyId }),
  ]);

  return {
    departments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// Create Department
export const createDepartment = async (data: CreateDepartmentProps) => {
  return await Department.create({
    companyId: data.companyId,
    department_name: data.department_name,
    logo: data.logo || "",
    status: data.status || DEPARTMENT_STATUS.ACTIVE,
  });
};

// Update Department
export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentProps
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }

  const department = await Department.findById(id);
  if (!department) throw new Error("Department not found");

  Object.assign(department, data);
  await department.save();

  return department;
};

// Delete Department
export const deleteDepartment = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid department ID");
  }

  const department = await Department.findById(id);
  if (!department) throw new Error("Department not found");

  await department.deleteOne();
  return { message: "Department deleted successfully" };
};
